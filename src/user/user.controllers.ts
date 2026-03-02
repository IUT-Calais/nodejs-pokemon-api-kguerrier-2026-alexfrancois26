import type { Request, Response } from 'express';
import prisma from '../client.js';
import bcrypt from 'bcrypt';
import e from 'express';

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
    try {
        const { email, password } = req.body;
        if (!await prisma.user.findUnique({
            where : {
                email:email,
            }
        })) {
            res.status(404).send({error : "Utilisateur non trouvé" });
            return;
        }
    } catch (error) {
        
    }
}