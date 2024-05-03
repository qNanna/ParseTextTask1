import { database } from "./database";

export async function importData(data: any) {
  const [{Employee}] = data['E-List'];

  for (const employee of Employee) {
    const { Donation, Department: [department], Salary: [{ Statement: Salaries }] } = employee;

    await database.saveEmployee({ ...employee, department_id: department.id });
    
    await database.saveDepartment({ ...department });

    for (const salary of Salaries) 
      await database.saveSalary({ ...salary, employee_id: employee.id })

    if (Donation)
      for (const donation of Donation)
        await database.saveDonation({ ...donation, employee_id: employee.id })
  }
}