"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, Edit, Trash2, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CategoryModal } from "@/components/category-modal"
import { TransactionModal } from "@/components/transaction-modal"
import { ConfirmModal } from "@/components/confirm-modal"

interface Category {
  id: string
  name: string
  budget_amount: number
  remaining_amount: number | null
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category: {
    id: string
    name: string
    budget_amount: number | null
    remaining_amount: number | null
  }
}

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ type: "category" | "transaction"; id: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return null
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  const fetchCategories = async () => {
    const headers = getAuthHeaders()
    if (!headers) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/private/category?year=${selectedYear}&month=${selectedMonth}`,
        { headers },
      )
      const data = await response.json()
      if (response.ok) {
        setCategories(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    }
  }

  const fetchTransactions = async () => {
    const headers = getAuthHeaders()
    if (!headers) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/private/transaction`, { headers })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchTransactions()
  }, [selectedMonth, selectedYear])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const handleDeleteCategory = async (id: string) => {
    const headers = getAuthHeaders()
    if (!headers) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/private/category/${id}`, {
        method: "DELETE",
        headers,
      })
      if (response.ok) {
        toast({ title: "Success", description: "Category deleted successfully" })
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    const headers = getAuthHeaders()
    if (!headers) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/private/transaction/${id}`, {
        method: "DELETE",
        headers,
      })
      if (response.ok) {
        toast({ title: "Success", description: "Transaction deleted successfully" })
        fetchTransactions()
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">Budgetin</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Date Filter */}
        <div className="flex gap-4">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
            <SelectTrigger className="w-40 bg-gray-900 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Budget Categories</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Card
              className="min-w-64 bg-gray-900 border-gray-700 border-dashed cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => {
                setEditingCategory(null)
                setCategoryModalOpen(true)
              }}
            >
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-400">Add Category</p>
                </div>
              </CardContent>
            </Card>

            {categories.map((category) => (
              <Card key={category.id} className="min-w-64 bg-gray-900 border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setCategoryModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteItem({ type: "category", id: category.id })
                          setConfirmModalOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span>{formatCurrency(category.budget_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Remaining:</span>
                      <span
                        className={
                          category.remaining_amount !== null && category.remaining_amount < 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }
                      >
                        {category.remaining_amount !== null
                          ? formatCurrency(category.remaining_amount)
                          : formatCurrency(category.budget_amount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Button
              onClick={() => {
                setEditingTransaction(null)
                setTransactionModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700">
                    <TableCell className="text-white">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {transaction.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell className="text-gray-400">{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTransaction(transaction)
                            setTransactionModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteItem({ type: "transaction", id: transaction.id })
                            setConfirmModalOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={editingCategory}
        onSuccess={() => {
          fetchCategories()
          setCategoryModalOpen(false)
          setEditingCategory(null)
        }}
      />

      <TransactionModal
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        transaction={editingTransaction}
        categories={categories}
        onSuccess={() => {
          fetchTransactions()
          fetchCategories()
          setTransactionModalOpen(false)
          setEditingTransaction(null)
        }}
      />

      <ConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        title={`Delete ${deleteItem?.type}`}
        description={`Are you sure you want to delete this ${deleteItem?.type}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteItem) {
            if (deleteItem.type === "category") {
              handleDeleteCategory(deleteItem.id)
            } else {
              handleDeleteTransaction(deleteItem.id)
            }
            setConfirmModalOpen(false)
            setDeleteItem(null)
          }
        }}
      />
    </div>
  )
}
