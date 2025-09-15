'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminstractureNavBar from '@/app/employee/shared/admisteratur-navbar/NavbarAdmin'
import { AlertCircle, CheckCircle, Users, Building2 } from 'lucide-react'

export default function MigrateTeamsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleMigration = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const response = await fetch('/api/admin/migrate-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Migration failed')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminstractureNavBar />
      
      <div className="container mx-auto px-4 sm:px-6 py-6 mt-16 mb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Team Migration Tool</h1>
            <p className="text-gray-600 mt-2">
              Assign existing users to teams based on their departments
            </p>
          </div>

          {/* Migration Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User-to-Team Migration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900">What this migration does:</h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>• Finds users without team assignments</li>
                      <li>• Creates default teams for departments that don't have them</li>
                      <li>• Assigns users to teams based on their department</li>
                      <li>• Sets team leaders automatically if found</li>
                      <li>• Updates team member lists</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleMigration}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running Migration...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Run Migration
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Migration Completed Successfully
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{result.processed}</div>
                    <div className="text-sm text-green-800">Users Processed</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.departments}</div>
                    <div className="text-sm text-blue-800">Departments</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{result.results.length}</div>
                    <div className="text-sm text-purple-800">Teams Created/Updated</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Department Results:</h4>
                  {result.results.map((dept, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="font-medium">{dept.department}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {dept.usersProcessed} users → {dept.team}
                        </div>
                      </div>
                      {dept.teamLeader && (
                        <div className="text-sm text-gray-500 mt-1">
                          Team Leader: {dept.teamLeader}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Migration Failed</span>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• This migration is safe to run multiple times</li>
                <li>• It only processes users who don't already have teams assigned</li>
                <li>• Existing team assignments will not be changed</li>
                <li>• Team leaders are automatically assigned based on user roles</li>
                <li>• After migration, all users will be available in team-based selection forms</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

