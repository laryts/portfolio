"use server"

import { cache } from "react"

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ContributionsData {
  total: number
  days: ContributionDay[]
  error?: string
}

// Cache the fetch operation to avoid unnecessary API calls
export const getGitHubContributions = cache(async (username: string): Promise<ContributionsData> => {
  try {
    // GitHub doesn't provide an official API for contribution data
    // We'll use a third-party API that scrapes this data
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub contributions: ${response.status}`)
    }

    const data = await response.json()

    // Process the data to match our format
    const total = data.total || 0
    const days: ContributionDay[] = data.contributions.map((contrib: any) => ({
      date: contrib.date,
      count: contrib.count,
      level: getContributionLevel(contrib.count),
    }))

    return { total, days }
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error)
    return {
      total: 0,
      days: [],
      error: error instanceof Error ? error.message : "Failed to fetch GitHub contributions",
    }
  }
})

// Helper function to determine contribution level (0-4) based on count
function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}
