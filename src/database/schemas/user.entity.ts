import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export type UserProfile = {
    id: number;
    email: string;
    nickname: string;
    interest: string;
    phone: string;
    role: boolean;
    img: string;
};

export type createUserInput = {
    id: number;
    email: string;
    password: string;
    nickname: string;
    interest: string;
    phone: string;
    role: boolean;
    img: string;
};

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar' })
    user_password!: string;

    @Column({ type: 'varchar' })
    nickname!: string;

    @Column({ type: 'int' })
    interest!: number;

    @Column({ type: 'varchar' })
    phone!: string;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    role!: boolean;

    @Column({ type: 'varchar', nullable: true, default: null })
    img!: string;
}