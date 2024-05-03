import { database } from "./database";

export async function importData(data: any) {
  const [ [{ Rate: Rates }], [{ Employee: Employees }] ] = [ data.Rates, data['E-List'] ];
  for (const rate of Rates) await database.saveRate(rate);

  for (const employee of Employees) {
    const { Donation, Department: [department], Salary: [{ Statement: Salaries }] } = employee;

    await database.saveEmployee({ ...employee, department_id: department.id });
    
    await database.saveDepartment({ ...department });

    for (const salary of Salaries) 
      await database.saveSalary({ ...salary, employee_id: employee.id })

    if (Donation) {
      for (const donation of Donation ) {
        const rate = Rates.find((rate: any) => rate.date === donation.date && rate.sign === donation.amount.split(' ')[1]);
        const usd_equivalent = rate ? (parseFloat(donation.amount) / parseFloat(rate.value)).toFixed(2) + ' USD' : null;

        await database.saveDonation({ ...donation, employee_id: employee.id, usd_equivalent })
      }
    }
  }
}