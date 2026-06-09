import React, { useEffect, useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  ResponsiveContainer,
} from "recharts";

const CustomYAxisTick = ({ x, y, payload }) => {
  return (
    <text
      x={x - 16}
      y={payload.coordinate + 5}
      textAnchor="middle"
      fill="var(--color-secondary-80)"
      fontSize={14}
      fontWeight={500}
      fontFamily="Onest, sans-serif"
    >
      ${payload.value}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="px-1 py-0.5 rounded-[5px] bg-secondary-15"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <p className="font-onest font-medium text-sm text-secondary">
          ${payload[0].value}
        </p>
      )}
    </div>
  );
};

const CustomizedLabel = ({ x, y, value, index }) => {
  if (value == null) return null;
  const padding = 4;
  const fontSize = 14;
  const textWidth = value?.toString().length * (fontSize * 0.6) || 0;
  const textHeight = fontSize;
  return (
    <g transform={`translate(${x}, ${y - 10})`}>
      <rect
        x={-textWidth / 2 - padding}
        y={-25}
        width={textWidth + padding * 4}
        height={textHeight + padding * 2}
        fill={`${index == 4 ? "var(--color-primary)" : index == 2 ? "var(--color-label-active)" : "var(--color-secondary-10)"}`}
        rx={5}
      />
      <text
        x={2}
        y={-12}
        fill={
          index === 2
            ? "var(--color-text-active)"
            : index === 4
              ? "var(--color-surface)"
              : "var(--color-secondary)"
        }
        fontSize={fontSize}
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        ${value}
      </text>
    </g>
  );
};

const CustomDot = (props) => {
  const { cx, cy, index } = props;
  if (cx == null || cy == null) return null;
  const specialIndexes = [2, 4];
  const isSpecial = specialIndexes.includes(index);
  let fill = "var(--color-secondary)";
  let r = 4;
  let stroke = "transparent";
  let strokeWidth = 2;

  if (index < 2) {
    stroke = "transparent";
    strokeWidth = 0;
  }
  if (index === 2) {
    fill = "var(--color-secondary)";
    stroke = "var(--color-primary)";
  }
  if (index > 2) {
    fill = "var(--color-secondary-30)";
  }
  if (index === 4) {
    fill = "var(--color-primary)";
    stroke = "var(--color-secondary-20)";
  }

  if (isSpecial) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={12} fill={stroke} />
        <circle cx={cx} cy={cy} r={9} fill="var(--color-dot-middle)" />
        <circle cx={cx} cy={cy} r={5} fill={fill} />
      </g>
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

const SaleChart = () => {
  const data1 = [
    { name: "STG 1", price: 0.05, future: null },
    { name: "STG 2", price: null, future: null },
    { name: "STG 3", price: 0.20, future: 0.20 },
    { name: "STG 4", price: null, future: 0.50 },
    { name: "LISTING", price: null, future: 1.00 },
  ];

  const data2 = [
    { name: "STG 1", price: 0.05, future: null },
    { name: "STG 3", price: 0.20, future: 0.20 },
    { name: "STG 4", price: null, future: 0.50 },
    { name: "LISTING", price: null, future: 1.00 },
  ];

  const data3 = [
    { name: "STG 1", price: 0.05, future: null },
    { name: "STG 3", price: 0.20, future: 0.20 },
    { name: "LISTING", price: null, future: 1.00 },
  ];

  const [data, setData] = useState(data1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 0 && window.innerWidth <= 480) {
        setData(data3);
      } else if (window.innerWidth > 480 && window.innerWidth <= 575) {
        setData(data2);
      } else {
        setData(data1);
      }
      setIsMobile(window.innerWidth <= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CustomXAxisTick = ({ x, y, payload }) => {
    const width = window.innerWidth;
    const isPoint = width > 800 && width <= 991;
    const tx = payload.coordinate + 40;
    const ty = y + 16;
    return (
      <text
        x={isMobile ? tx - 10 : tx}
        y={isMobile ? ty - 25 : ty}
        textAnchor="middle"
        transform={
          isPoint
            ? `rotate(-25 ${tx + 40} ${ty - 10})`
            : isMobile
              ? `rotate(-25 ${tx + 40} ${ty + 10})`
              : `rotate(0 ${x} ${y})`
        }
        fill="var(--color-secondary-80)"
        fontSize={isMobile ? 12 : 13}
        fontWeight={500}
        fontFamily="Onest, sans-serif"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="w-full h-55 sm:h-62.5 2xl:h-75 relative overflow-hidden uppercase mb-7 pr-5 md:pr-6.25 2xl:pr-10">
      <div className="absolute inset-x-0 bottom-8.75 top-0 grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 pl-15.75 pr-5.75 2xl:pr-10.75">
        {data?.map((_, i) => (
          <div key={i} className="h-full border-r border-b border-secondary-10" />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-8.75 top-0 grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 pl-15.75 pr-5.75 2xl:pr-10.75 pointer-events-none">
        <div className="col-span-1 xs:col-span-2 sm:col-span-2" />
        <div className="bg-primary-8" />
        <div className="col-span-1 xs:col-span-1 sm:col-span-2" />
      </div>

      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart data={data}>
          <XAxis
            scale="band"
            dataKey="name"
            type="category"
            allowDuplicatedCategory={false}
            axisLine={{ stroke: "var(--color-secondary-10)", strokeWidth: 0 }}
            tickLine={false}
            tick={<CustomXAxisTick />}
            interval={0}
          />
          <YAxis
            dataKey="price"
            axisLine={{ stroke: "var(--color-secondary-10)", strokeWidth: 1 }}
            tickLine={false}
            domain={[0, 1.2]}
            tickCount={4}
            tick={<CustomYAxisTick />}
          />
          <Tooltip active={false} content={<CustomTooltip />} />
          <Line
            connectNulls
            type="linear"
            data={data}
            dataKey="price"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="#ffffff"
            label={CustomizedLabel}
            activeDot={false}
            dot={<CustomDot />}
          />
          <Line
            connectNulls
            type="linear"
            dataKey="future"
            stroke="var(--color-secondary-20)"
            strokeWidth={2}
            strokeDasharray={[3, 3]}
            fill="#ffffff"
            label={CustomizedLabel}
            activeDot={false}
            dot={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SaleChart;