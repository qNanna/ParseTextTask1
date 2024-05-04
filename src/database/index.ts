import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';

import * as fs from 'fs/promises';
import { join } from 'path';

import { IEmployee, IDepartment, ISalary, IDonation, IRate } from './interfaces/index';

class Database {
    private connection: sqlite.Database<sqlite3.Database, sqlite3.Statement> = null as any;

    async init(fileName = '/tmp/database.db') {
        const path = join(process.cwd(), fileName);
    
        await fs.access(path, fs.constants.R_OK)
            .catch(async () => {
                console.info('Database file not exists. Creating...')
                await fs.writeFile(path, '')
            })
    
        this.connection = await sqlite.open({
            filename: path,
            driver: sqlite3.Database
        });
    
        await this.connection.migrate({ migrationsPath: join(process.cwd(), 'src/database/migrations'), force: true })
    
        return this.connection;
    }

    async saveEmployee(data: IEmployee) {
        await this.connection.run(`INSERT INTO Employee (id, name, surname, department_id) VALUES (:id, :name, :surname, :department_id)`, {
            ':id': data.id,
            ':name': data.name,
            ':surname': data.surname,
            ':department_id': data.department_id
        });
    }

    async saveDepartment(data: IDepartment) {
        await this.connection.run(`
            INSERT OR IGNORE INTO Department (id, name) VALUES (:id, :name)`, {
            ':id': data.id,
            ':name': data.name
        });
    }

    async saveSalary(data: ISalary) {
        await this.connection.run(`INSERT INTO Salary (id, amount, date, employee_id) VALUES (:id, :amount, :date, :employee_id)`, {
            ':id': data.id,
            ':amount': data.amount,
            ':date': data.date,
            ':employee_id': data.employee_id
        });
    }

    async saveDonation(data: IDonation) {
        await this.connection.run(`
            INSERT INTO Donation (id, date, amount, employee_id, usd_equivalent) 
            SELECT :id, :date, :amount, :employee_id, ROUND((:amount / r.value), 2) AS usd_equivalent
            FROM Rate r
            WHERE r.date = :date
            AND r.sign = SUBSTR(:amount, INSTR(:amount, ' ') + 1)
            `, {
                ':id': data.id,
                ':amount': data.amount,
                ':date': data.date,
                ':employee_id': data.employee_id,
            }
        );
    }

    async saveRate(data: IRate) {
        await this.connection.run(`INSERT INTO Rate (date, sign, value) VALUES (:date, :sign, :value)`, {
            ':date': data.date,
            ':sign': data.sign,
            ':value': data.value
        });
    }
}

export const database = new Database();