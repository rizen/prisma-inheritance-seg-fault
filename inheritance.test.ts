import { describe, test, expect } from "vitest";
import { PrismaClient, Prisma } from '@prisma/client'

type TProps = Partial<Prisma.TypeMap['model']['User']['create']['payload']['scalars']>;

// base class
class VingRecord {

    constructor(public prisma: any, public props: TProps) { }

    public async verifyPostedParams(params: TProps) {

        // remove the line below (in both tests) and no seg fault
        await this.prisma.count({ where: { username: 'doesnt matter whats here' } });
        this.props.username = params.username;

        return true;
    }
}

// subclass
class UserRecord extends VingRecord {

    public async verifyPostedParams(params: TProps) {
        super.verifyPostedParams(params);
        // imagine coolness here
        return true;
    }

}

// test
describe('Users', async () => {
    let prisma = new PrismaClient();
    let params = { username: 'rita' };
    const rita = new UserRecord(prisma.user, params)

    test('can verify posted params', async () => {
        expect(await rita.verifyPostedParams(params)).toBe(true);
        expect(rita.props.username).toBe('rita');
    });

})