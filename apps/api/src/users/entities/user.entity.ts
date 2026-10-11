
import { Entity, Column } from 'typeorm';
import {BaseEntity} from "../../utils/base.entity.js";
import {Exclude} from "class-transformer";

@Entity()
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    @Exclude()
    hashedPassword: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}
