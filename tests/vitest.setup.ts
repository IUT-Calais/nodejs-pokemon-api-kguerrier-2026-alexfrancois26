import type { DeepMockProxy } from 'vitest-mock-extended'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { beforeEach, vi } from 'vitest'
// Import du client mocké
import prisma from '../src/client'
import type { PrismaClient } from "../src/generated/prisma/client.js";


vi.mock('../src/client', () => ({
    default: mockDeep<PrismaClient>(),
}))



vi.mock('../src/common/auth.middleware', () => ({
    verifyJWT: vi.fn((req, res, next) => {
        req.userId = 1
        next()
    }),
}))

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashedPassword'),
        compare: vi.fn(async (password) => password === 'truePassword'),
    },
}))

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



beforeEach(() => {
    mockReset(prismaMock)
})
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>