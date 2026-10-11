
import { Entity, Column } from 'typeorm';
import {BaseEntity} from "../../utils/entities/base.entity.js";

@Entity()
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    // @Exclude()
    hashedPassword: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}
