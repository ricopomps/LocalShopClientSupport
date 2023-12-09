import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import br from "date-fns/locale/pt-BR";
import TextInputField from "../components/form/TextInputField";
import styles from "../styles/ReportsPage.module.css";
import * as ReportsApi from "../network/reportsApi";
import { ChartData } from "../network/reportsApi";
import Chart, { ChartTypeEnum } from "../components/Chart/Chart";

registerLocale("br", br);

export enum Charts {
  income = "Rendimentos",
  sales = "Produtos vendidos",
  incomeByProducts = "Rendimentos por produto",
}

const ReportsPage = () => {
  const [selectedChart, setSelectedChart] = useState<Charts>(Charts.income);
  const [selectedChartType, setSelectedChartType] = useState<ChartTypeEnum>(
    ChartTypeEnum.Bar
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [data, setData] = useState<ChartData | null>(null);

  const chartTypeLabels = {
    bar: { label: "Barra", implemented: true },
    line: { label: "Linha", implemented: true },
    pie: { label: "Pizza", implemented: false },
    bubble: { label: "Bolha", implemented: false },
    doughnut: { label: "Rosquinha", implemented: false },
    polarArea: { label: "Área Polar", implemented: false },
    radar: { label: "Radar", implemented: false },
    scatter: { label: "Dispersão", implemented: false },
  };

  const getChart = async () => {
    try {
      let chartData: ChartData;
      switch (selectedChart) {
        case Charts.income:
          chartData = await ReportsApi.getIncomeReport(startDate, endDate);
          break;

        case Charts.sales:
          chartData = await ReportsApi.getReportProductsSold(
            startDate,
            endDate
          );
          break;
        case Charts.incomeByProducts:
          chartData = await ReportsApi.getIncomeByProductReport(
            startDate,
            endDate
          );
          break;
      }
      setData(chartData);
    } catch (error: any) {
      setData(null);
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  useEffect(() => {
    getChart();
  }, [selectedChart, startDate, endDate]);

  const { register } = useForm();
  const ChartComponent = () => {
    if (!data) return <></>;
    switch (selectedChart) {
      case Charts.income: {
        return <Chart data={data} currency chartType={selectedChartType} />;
      }
      case Charts.sales: {
        return (
          <Chart data={data} showLabelInTitle chartType={selectedChartType} />
        );
      }
      case Charts.incomeByProducts: {
        return (
          <Chart
            data={data}
            currency
            showLabelInTitle
            chartType={selectedChartType}
          />
        );
      }
    }
  };

  return (
    <div>
      <div className={styles.formContainer}>
        <div>
          <DatePicker
            className={styles.datePicker}
            selected={startDate}
            onChange={(date: Date) => {
              setStartDate(date);
            }}
            locale="br"
            showMonthYearPicker
            dateFormat="yyyy - MMMM"
            maxDate={endDate}
          />
        </div>
        <div className={styles.inputsDesktop}>
          <TextInputField
            name="chart"
            type="text"
            as="select"
            options={Object.values(Charts).map((c) => {
              return { value: c, key: c };
            })}
            register={register}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedChart(e.target.value as Charts);
            }}
            className={styles.selectType}
          />
          <TextInputField
            name="chartType"
            type="text"
            as="select"
            options={Object.values(ChartTypeEnum).map((c) => {
              const label = chartTypeLabels[c].label || c;
              return {
                value: c,
                key: label,
                disabled: !chartTypeLabels[c].implemented,
                show: !chartTypeLabels[c].implemented,
              };
            })}
            register={register}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedChartType(e.target.value as ChartTypeEnum);
            }}
            className={styles.selectType}
          />
        </div>
        <div className={styles.endDatePickerContainer}>
          <DatePicker
            className={styles.datePicker}
            selected={endDate}
            onChange={(date: Date) => {
              setEndDate(date);
            }}
            locale="br"
            showMonthYearPicker
            dateFormat="yyyy - MMMM"
            minDate={startDate}
          />
        </div>
      </div>
      <ChartComponent />
    </div>
  );
};

export default ReportsPage;
