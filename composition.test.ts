import { describe, test, expect } from "vitest";
import { PrismaClient, Prisma } from '@prisma/client'

type TProps = Partial<Prisma.TypeMap['model']['User']['create']['payload']['scalars']>;

//original
function useVingRecord(prisma: any, props: TProps) {
    return {
        props,
        async verifyPostedParams(params: TProps) {

            // remove the line below (in both tests) and no seg fault
            await prisma.count({ where: { username: 'doesnt matter whats here' } });
            props.username = params.username;

            return true;
        }
    }
}

// composition
function useUserRecord(prisma: any, props: TProps) {
    const base = useVingRecord(prisma, props)
    return {
        ...base,
        async verifyPostedParams(params: TProps) {
            base.verifyPostedParams(params);
            // imagine coolness here
            return true;
        }
    }
}

//test
describe('Users', async () => {
    let prisma = new PrismaClient();
    let params = { username: 'rita' };
    const rita = useUserRecord(prisma.user, params)

    test('can verify posted params', async () => {
        expect(await rita.verifyPostedParams(params)).toBe(true);
        expect(rita.props.username).toBe('rita');
    });
})