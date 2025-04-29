"use client"

import { useState, useEffect } from "react"
import { getGitHubContributions } from "@/app/actions/github"
import { AnimateOnScroll } from "./animate-on-scroll"

interface GitHubContributionsChartProps {
  username: string
  title: string
  subtitle: string
  loadingText: string
  errorText: string
  totalText: string
}

export function GitHubContributionsChart({
  username,
  title,
  subtitle,
  loadingText,
  errorText,
  totalText,
}: GitHubContributionsChartProps) {
  const [contributions, setContributions] = useState<{
    total: number
    days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[]
    error?: string
  }>({ total: 0, days: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await getGitHubContributions(username)
        console.log("data", data)
        setContributions(data)
      } catch (error) {
        console.error("Error in component:", error)
        setContributions({ total: 0, days: [], error: "Failed to load contributions" })
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [username])

  // Group days by week for the calendar view
  const weeks = []
  if (contributions.days.length > 0) {
    let currentWeek: typeof contributions.days = []

    // Get the last 365 days (or less if not available)
    const recentDays = contributions.days.slice(-365)

    for (const day of recentDays) {
      currentWeek.push(day)

      // Start a new week every 7 days
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek = []
      }
    }

    // Add the remaining days as the last week
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek])
    }
  }

  // Get month labels for the x-axis
  const months = []
  if (contributions.days.length > 0) {
    const recentDays = contributions.days.slice(-365)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let currentMonth = -1
    for (const day of recentDays) {
      const date = new Date(day.date)
      const month = date.getMonth()

      if (month !== currentMonth) {
        currentMonth = month
        months.push({
          name: monthNames[month],
          index: recentDays.indexOf(day),
        })
      }
    }
  }

  return (
    <AnimateOnScroll animation="fade" duration={0.8}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{subtitle}</p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-deep-purple-900 dark:border-deep-purple-400"></div>
            <span className="ml-2">{loadingText}</span>
          </div>
        ) : contributions.error ? (
          <div className="text-center text-red-500 py-8">{errorText}</div>
        ) : (
          <>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[750px]">
                {/* Month labels */}
                <div className="flex mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-8"></div> {/* Spacer for day labels */}
                  {months.map((month, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{
                        marginLeft: i === 0 ? `${(month.index / 7) * 100}%` : "0",
                        width: i === months.length - 1 ? `${100 - (month.index / 7) * 100}%` : "auto",
                      }}
                    >
                      {month.name}
                    </div>
                  ))}
                </div>

                {/* Contribution grid */}
                <div className="flex">
                  {/* Day labels */}
                  <div className="flex flex-col justify-around text-xs text-gray-500 dark:text-gray-400 mr-2">
                    <div>Mon</div>
                    <div>Wed</div>
                    <div>Fri</div>
                  </div>

                  {/* Contribution cells */}
                  <div className="flex-1 grid grid-flow-col gap-1">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-rows-7 gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`w-3 h-3 rounded-sm ${
                              day.level === 0
                                ? "bg-gray-100 dark:bg-gray-700"
                                : day.level === 1
                                  ? "bg-deep-purple-100 dark:bg-deep-purple-900"
                                  : day.level === 2
                                    ? "bg-deep-purple-300 dark:bg-deep-purple-700"
                                    : day.level === 3
                                      ? "bg-deep-purple-500 dark:bg-deep-purple-500"
                                      : "bg-deep-purple-700 dark:bg-deep-purple-300"
                            }`}
                            title={`${day.date}: ${day.count} contributions`}
                          ></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="mr-2">
                    {totalText}: {contributions.total}
                  </span>
                  <span className="mr-1">Less</span>
                  <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-deep-purple-100 dark:bg-deep-purple-900 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-deep-purple-300 dark:bg-deep-purple-700 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-deep-purple-500 dark:bg-deep-purple-500 mr-1"></div>
                  <div className="w-3 h-3 rounded-sm bg-deep-purple-700 dark:bg-deep-purple-300 mr-1"></div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AnimateOnScroll>
  )
}
