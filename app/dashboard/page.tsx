"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, Plus, Edit, Trash2, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CategoryModal } from "@/components/category-modal"
import { TransactionModal } from "@/components/transaction-modal"
import { ConfirmModal } from "@/components/confirm-modal"

interface User {
  id: string
  email: string
  currency: string
  name: string
}

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

const ITEMS_PER_PAGE = 10

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
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

  const fetchUser = async () => {
    const headers = getAuthHeaders()
    if (!headers) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/private/user`, { headers })
      const data = await response.json()
      if (response.ok) {
        setUser(data.data)
      } else {
        // If user fetch fails, likely token is invalid
        localStorage.removeItem("token")
        router.push("/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/private/transaction?year=${selectedYear}&month=${selectedMonth}`,
        { headers },
      )
      const data = await response.json()
      if (response.ok) {
        const sortedTransactions = data.data.sort(
          (a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        setTransactions(sortedTransactions)
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
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchCategories()
      fetchTransactions()
    }
  }, [selectedMonth, selectedYear, user])

  useEffect(() => {
    let filtered = transactions

    if (selectedCategory !== "all") {
      filtered = transactions.filter((transaction) => transaction.category.id === selectedCategory)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [transactions, selectedCategory])

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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: user?.currency || "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID")
  }

  const getProgressValue = (category: Category) => {
    if (category.remaining_amount === null) return 0
    const used = category.budget_amount - category.remaining_amount
    return (used / category.budget_amount) * 100
  }

  const getUsedAmount = (category: Category) => {
    if (category.remaining_amount === null) return 0
    return category.budget_amount - category.remaining_amount
  }

  const getRemainingPercentage = (category: Category) => {
    if (category.remaining_amount === null) return 100
    return (category.remaining_amount / category.budget_amount) * 100
  }

  const getCardBorderColor = (category: Category) => {
    const remainingPercentage = getRemainingPercentage(category)
    if (remainingPercentage <= 15) {
      return "border-red-500/50"
    }
    return "border-blue-500/30"
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const totalBudget = categories.reduce((sum, category) => sum + category.budget_amount, 0)
  const totalRemaining = categories.reduce(
    (sum, category) => sum + (category.remaining_amount || category.budget_amount),
    0,
  )

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 backdrop-blur-xl bg-gray-950/80">
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
        {/* Profile & Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-semibold">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Budget Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalBudget)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Remaining Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Remaining</p>
                <p
                  className={`text-2xl font-bold ${totalRemaining < totalBudget * 0.15 ? "text-red-400" : "text-green-400"}`}
                >
                  {formatCurrency(totalRemaining)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setCategoryModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`min-w-64 backdrop-blur-xl bg-white/5 border shadow-xl hover:bg-white/10 transition-all duration-300 ${getCardBorderColor(category)}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{category.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setCategoryModalOpen(true)
                        }}
                        className="hover:bg-white/10"
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
                        className="hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {formatCurrency(getUsedAmount(category))} / {formatCurrency(category.budget_amount)}
                      </span>
                      <span
                        className={`font-medium ${getRemainingPercentage(category) <= 15 ? "text-red-400" : "text-blue-400"}`}
                      >
                        {getRemainingPercentage(category).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={getProgressValue(category)}
                      className="h-2"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Remaining</p>
                    <p
                      className={`text-lg font-semibold ${getRemainingPercentage(category) <= 15 ? "text-red-400" : "text-blue-400"}`}
                    >
                      {formatCurrency(category.remaining_amount || category.budget_amount)}
                    </p>
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
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
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
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-white/5">
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
                          className="hover:bg-white/10"
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
                          className="hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of{" "}
                  {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gray-700 hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gray-700 hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
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
