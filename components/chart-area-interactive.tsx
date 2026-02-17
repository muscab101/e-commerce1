"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, where, Timestamp } from "firebase/firestore"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { IconLoader2 } from "@tabler/icons-react"

const chartConfig = {
  desktop: {
    label: "Store Sales",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Online Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [rawData, setRawData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    
    // Xisaabi taariikhda bilowga ah ee salka ku haysa timeRange
    const now = new Date()
    const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000)

    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      orderBy("createdAt", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dailyMap: Record<string, { date: string, desktop: number, mobile: number }> = {}

      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        const date = data.createdAt?.toDate().toISOString().split('T')[0] // Format: YYYY-MM-DD
        const amount = data.amount || 0
        const isOnline = data.source === "online" // Hubi in "source" field uu jiro

        if (!dailyMap[date]) {
          dailyMap[date] = { date, desktop: 0, mobile: 0 }
        }

        if (isOnline) {
          dailyMap[date].mobile += amount
        } else {
          dailyMap[date].desktop += amount
        }
      })

      setRawData(Object.values(dailyMap))
      setLoading(false)
    }, (error) => {
      console.error("Firebase Error:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [timeRange])

  const total = React.useMemo(() => ({
    desktop: rawData.reduce((acc, curr) => acc + curr.desktop, 0),
    mobile: rawData.reduce((acc, curr) => acc + curr.mobile, 0),
  }), [rawData])

  return (
    <Card className="border-none shadow-sm overflow-hidden font-sans">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row bg-card">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-left">
          <CardTitle className="text-xl font-bold uppercase tracking-tight">Revenue Analytics</CardTitle>
          <CardDescription className="font-medium text-xs">
            Live store performance from Firebase
          </CardDescription>
        </div>
        
        <div className="flex border-t sm:border-t-0 sm:border-l">
          {[
            { key: "desktop", label: "Store", value: total.desktop },
            { key: "mobile", label: "Online", value: total.mobile },
          ].map((item) => (
            <div
              key={item.key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:w-40 sm:px-8 sm:py-6 bg-muted/10"
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {item.label}
              </span>
              <span className="text-xl font-bold leading-none sm:text-2xl">
                ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center px-6 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            className="hidden lg:flex"
          >
            <ToggleGroupItem value="90d" className="text-[10px] font-bold uppercase h-8">90D</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="text-[10px] font-bold uppercase h-8">30D</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="text-[10px] font-bold uppercase h-8">7D</ToggleGroupItem>
          </ToggleGroup>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] lg:hidden h-9 font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 Months</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <IconLoader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={rawData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} className="stroke-muted/30" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }}
                className="text-[10px] font-bold uppercase"
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="mobile"
                type="monotone"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="monotone"
                fill="url(#fillDesktop)"
                stroke="var(--color-primary)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}