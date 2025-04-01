import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [darkMode, setDarkMode] = useState(false);
  const [user] = useState("User1");
  const [userExpenses, setUserExpenses] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  
  const categoryIcons = {
    Food: "🍔",
    Transport: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Bills: "💡",
    Other: "📌",
  };

  const addExpense = () => {
    if (!category || !amount) return;
    const newExpense = { category, amount: parseFloat(amount), description, date: new Date().toLocaleDateString(), currency, paymentMethod };
    setExpenses([...expenses, newExpense]);
    setUserExpenses({ ...userExpenses, [user]: [...(userExpenses[user] || []), newExpense] });
    setCategory("");
    setAmount("");
    setDescription("");
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = income - totalSpent;

  const exportToCSV = () => {
    let csvContent = "Category,Amount,Description,Date,Currency,Payment Method\n";
    expenses.forEach(exp => {
      csvContent += `${exp.category},${exp.amount},${exp.description},${exp.date},${exp.currency},${exp.paymentMethod}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 20, 20);
    let yPos = 30;
    expenses.forEach((exp, index) => {
      doc.text(`${index + 1}. ${exp.category} - ${exp.currency} ${exp.amount} (${exp.description}) [${exp.paymentMethod}]`, 20, yPos);
      yPos += 10;
    });
    doc.save("expenses.pdf");
  };

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, [darkMode]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-primary">Expense Tracker</h2>
        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="card shadow p-4 mt-3">
        <div className="mb-3">
          <input type="number" className="form-control" placeholder="Enter Income" value={income} onChange={(e) => setIncome((e.target.value) )} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <div className="mb-3">
          <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Card">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <button className="btn btn-primary w-100" onClick={addExpense}>Add Expense</button>
      </div>
      <h3 className="mt-4">Your Expenses</h3>
      <ul className="list-group mt-2">
        {expenses.length === 0 ? (
          <p className="text-muted text-center">No expenses added yet.</p>

        ) : (
          expenses.map((expense, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{categoryIcons[expense.category] || "📌"} {expense.category}</strong> - {expense.currency} {expense.amount.toFixed(2)} ({expense.paymentMethod})
                <p className="text-muted mb-0">{expense.description || "No description"} | {expense.date}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeExpense(index)}>Remove</button>
            </li>
          ))
        )}
      </ul>
      <div className="mt-4 p-3 bg-light-dark border rounded text-center">
        <h4>Total Spent: <span className="text-danger">{currency} {totalSpent.toFixed(2)}</span></h4>
        <h4>Remaining Balance: <span className={remainingBalance < 0 ? "text-danger" : "text-success"}>{currency} {remainingBalance.toFixed(2)}</span></h4>
      </div>
      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-success" onClick={exportToCSV}>Export to CSV</button>
        <button className="btn btn-warning" onClick={exportToPDF}>Export to PDF</button>
      </div>
    </div>
  );
}