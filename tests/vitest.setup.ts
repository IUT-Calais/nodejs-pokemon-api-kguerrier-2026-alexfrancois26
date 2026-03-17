import type { DeepMockProxy } from 'vitest-mock-extended'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { beforeEach, vi } from 'vitest'
// Import du client mocké
import prisma from '../src/client'
import type { PrismaClient } from "../src/generated/prisma/client.js";


// Mock du module Prisma
vi.mock('../src/client', () => ({
    default: mockDeep<PrismaClient>(),
}))


// Mock du middleware d'authentification
vi.mock('../src/common/auth.middleware', () => ({
    verifyJWT: vi.fn((req, res, next) => {
        // Simule un utilisateur authentifié
        req.userId = 1
        next()
    }),
}))

// Mock de bcrypt
vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashedPassword'),
        compare: vi.fn(async (password) => password === 'truePassword'),
    },
}))

// Mock de jsonwebtoken
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn().mockReturnValue('mockedToken'),
        verify: vi.fn((token) => {
            if (token === 'mockedToken') {
                return { userId: 1, email: 'test@example.com' }
            }
            throw new Error('Invalid token')
        }),
    },
}))


// Reset des mocks avant chaque test
beforeEach(() => {
    mockReset(prismaMock)
})
// Export du mock typé
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>