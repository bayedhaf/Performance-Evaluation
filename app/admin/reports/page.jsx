'use client'

import React, { useState, useEffect } from 'react'
import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  Calendar,
  Download,
  RefreshCw,
  FileText,
  PieChart
} from 'lucide-react'

export default function Reports() {
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchReports()
  }, [reportType, dateRange])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: reportType,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate })
      })

      const response = await fetch(`/api/admin/reports?${params}`)
      if (!response.ok) throw new Error('Failed to fetch reports')
      const data = await response.json()
      
      setReports(data.data || {})
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (key, value) => {
    setDateRange(prev => ({ ...prev, [key]: value }))
  }

  const downloadReport = (type) => {
    // This would typically generate and download a PDF/Excel report
    alert(`Downloading ${type} report...`)
  }

  const getReportIcon = (type) => {
    switch (type) {
      case 'overview': return <BarChart3 className="w-6 h-6" />
      case 'users': return <Users className="w-6 h-6" />
      case 'departments': return <Building2 className="w-6 h-6" />
      case 'performance': return <TrendingUp className="w-6 h-6" />
      default: return <FileText className="w-6 h-6" />
    }
  }

  const getReportTitle = (type) => {
    switch (type) {
      case 'overview': return 'System Overview'
      case 'users': return 'User Analytics'
      case 'departments': return 'Department Reports'
      case 'performance': return 'Performance Metrics'
      default: return 'Report'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminstractureNavBar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminstractureNavBar />
      
      <div className="container mx-auto px-6 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Generate comprehensive reports about your organization</p>
          </div>
          
          <Button onClick={fetchReports} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Report Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">System Overview</SelectItem>
                    <SelectItem value="users">User Analytics</SelectItem>
                    <SelectItem value="departments">Department Reports</SelectItem>
                    <SelectItem value="performance">Performance Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Report */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getReportIcon(reportType)}
                  <span>{getReportTitle(reportType)}</span>
                </div>
                <Button onClick={() => downloadReport(reportType)} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading report: {error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reportType === 'overview' && reports.summary && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">System Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{reports.summary.totalUsers}</div>
                          <div className="text-sm text-blue-600">Total Users</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{reports.summary.activeUsers}</div>
                          <div className="text-sm text-green-600">Active Users</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{reports.summary.totalDepartments}</div>
                          <div className="text-sm text-purple-600">Departments</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{reports.summary.totalTeams}</div>
                          <div className="text-sm text-orange-600">Teams</div>
                        </div>
                      </div>
                      
                      {reports.roleDistribution && (
                        <div className="mt-6">
                          <h4 className="text-md font-semibold mb-3">Role Distribution</h4>
                          <div className="space-y-2">
                            {reports.roleDistribution.map((role) => (
                              <div key={role._id} className="flex justify-between items-center">
                                <span className="capitalize">{role._id}</span>
                                <Badge variant="secondary">{role.count} users</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {reportType === 'users' && reports.users && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Name</th>
                              <th className="text-left py-2">Role</th>
                              <th className="text-left py-2">Department</th>
                              <th className="text-left py-2">Status</th>
                              <th className="text-left py-2">Last Login</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.users.slice(0, 10).map((user) => (
                              <tr key={user._id} className="border-b">
                                <td className="py-2">{user.fullName}</td>
                                <td className="py-2">
                                  <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="py-2">{user.department?.name || 'Not Assigned'}</td>
                                <td className="py-2">
                                  <Badge variant={user.isActive ? "default" : "destructive"}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </td>
                                <td className="py-2">
                                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {reportType === 'departments' && reports.departments && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Department Reports</h3>
                      <div className="space-y-4">
                        {reports.departments.map((dept) => (
                          <div key={dept.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold">{dept.name}</h5>
                              <Badge variant="outline">{dept.code}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Total Employees:</span>
                                <span className="ml-2 font-medium">{dept.employeeCount}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Active Employees:</span>
                                <span className="ml-2 font-medium">{dept.activeEmployees}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reportType === 'performance' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>{reports.message || 'Performance metrics will be available once evaluation data is added to the system.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Quick Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Report Generated</span>
                  <span className="text-sm text-gray-500">
                    {reports.generatedAt ? new Date(reports.generatedAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Report Type</span>
                  <Badge variant="outline">{getReportTitle(reportType)}</Badge>
                </div>
                {dateRange.startDate && dateRange.endDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Range</span>
                    <span className="text-sm text-gray-500">
                      {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => downloadReport(reportType)} 
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {getReportTitle(reportType)}
                </Button>
                
                <Button 
                  onClick={() => window.print()} 
                  className="w-full"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
                
                <Button 
                  onClick={fetchReports} 
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
