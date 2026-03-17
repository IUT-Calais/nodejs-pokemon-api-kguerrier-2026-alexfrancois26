import type { Request, Response } from 'express';
import prisma from '../client.js';
import bcrypt from 'bcrypt';
import e from 'express';
import { error } from 'console';
import jwt from 'jsonwebtoken';


export const createUser = async (req : Request, res : Response) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ error : "Email et MDP sont requis" });
            return;
        }
        if (await prisma.user.findUnique({
            where : {
                email:email
            }
        })) 
        {
            res.status(400).send({error : "Mail déjà utilisé" });
            return;
        }
        let encryptedPassword = await bcrypt.hash(password, 10);
        res.status(201).send(await prisma.user.create({
            data : {
                email :email,
                password : encryptedPassword
            }
        }))
    } catch (error) {
        res.status(500).send({ error : "Erreur lors de la création de l'utilisateur" });
    }
}

export const loginUser = async ( req : Request, res : Response) => {

    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where : {
                email:email
            }
        })
        if (!user) {
            res.status(401).send({error : "Email ou mot de passe incorrect" }); 
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send({error : "Email ou mot de passe incorrect" });
            return;
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
            
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
        );
        res.status(200).send({
            message :   "Connexion réussie",
            token,
            user : {
                id : user.id,
                email : user.email

            },
        })
        return;

    } catch (error) {
        console.error(error);
        res.status(500).send({ error : "Erreur lors de la connexion" });    
        return;
    }
}

export const getUsers = async (req : Request, res : Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error : "Erreur lors de la récupération des utilisateurs" });
    }
}

export const getUserById = async (req : Request, res : Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where : {
                id : Number(id)
            }
        });
        if (!user) {
            res.status(404).send({ error : "L'utilisateur n'existe pas" });
            return;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error : "Erreur lors de la récupération de l'utilisateur" });
    }
}

export const updateUser = async (req : Request, res : Response) => {
    const { id } = req.params;
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where : {
                id : Number(id)
            }
        });
        if (!user) {
            res.status(404).send({ error : "L'utilisateur n'existe pas" });
            return;
        }
        if (email && email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where : {
                    email : email
                }
            });
            if (existingUser) {
                res.status(400).send({ error : "Cet email est déjà utilisé" });
                return;
            }
        }
        let dataToUpdate : any = {};
        if (email) {
            dataToUpdate.email = email;
        }
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where : {
                id : Number(id)
            },
            data : dataToUpdate
        });
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({ error : "Erreur lors de la modification de l'utilisateur" });
    }
}

export const deleteUser = async (req : Request, res : Response) => {
    const { id } = req.params;
    try {
        const deletedUser = await prisma.user.delete({
            where : {
                id : Number(id)
            }
        });
        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(500).send({ error : "Erreur lors de la suppression de l'utilisateur" });
    }
}