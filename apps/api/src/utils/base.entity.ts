import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { dateColumnType } from '../database/column-types';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: dateColumnType, default: null })
  createdAt: Date;

  @UpdateDateColumn({ type: dateColumnType, default: null })
  updatedAt: Date;

  @DeleteDateColumn({ type: dateColumnType, default: null })
  deletedAt: Date | null;

  @Column('boolean', { default: true })
  isActive = true;
}

export type BaseEntityKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive';
