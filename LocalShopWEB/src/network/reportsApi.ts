import { endOfMonth, startOfMonth } from "date-fns";
import { Charts } from "../pages/ReportsPage";
import ApiService from "./api";

interface SingularValue {
  label: string;
  value: number;
}

interface SingleReportData {
  month: string;
  value: number;
}

interface MultipleReportData {
  month: string;
  values: SingularValue[];
}

type ReportData = SingleReportData[] | MultipleReportData[];

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  minBarLength?: number;
  borderColor: string;
  borderWidth: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}
const apiService = ApiService.getInstance();

function isSingleReportData(data: ReportData): data is SingleReportData[] {
  return "value" in data[0];
}

function isMultipleReportData(data: ReportData): data is MultipleReportData[] {
  return "values" in data[0];
}

function transformDataForChart(
  backendData: ReportData,
  reportType?: Charts
): ChartData {
  if (backendData?.length === 0)
    throw Error("Não existem dados para o período informado");
  if (isMultipleReportData(backendData)) {
    const labels = backendData.map((entry) => entry.month);
    const datasets: Dataset[] = [];

    const uniqueLabels = Array.from(
      new Set(
        backendData.flatMap((entry) => entry.values.map((value) => value.label))
      )
    );
    const labelColors: string[] = [
      "#ffbe0b",
      "#fb5607",
      "#ff006e",
      "#8338ec",
      "#3a86ff",
      "#8bf08b",
    ];

    uniqueLabels.forEach((label, index) => {
      const data = backendData.map(
        (entry) =>
          entry.values.find((value) => value.label === label)?.value ?? 0
      );

      datasets.push({
        label,
        minBarLength: 7,
        data,
        backgroundColor: [labelColors[index % labelColors.length]],
        borderColor: "black",
        borderWidth: 2,
      });
    });

    return {
      labels,
      datasets,
    };
  } else if (isSingleReportData(backendData)) {
    return {
      labels: backendData.map((entry) => entry.month),
      datasets: [
        {
          label: reportType ?? "Relatório",
          data: backendData.map((entry) => entry.value),
          backgroundColor: [`#f8ce41`],
          borderColor: "black",
          minBarLength: 7,
          borderWidth: 2,
        },
      ],
    };
  } else {
    throw new Error("Formato de inválido de informações");
  }
}

const baseUrl = "/api/reports";

export async function getReport(
  startDate: Date,
  endDate: Date
): Promise<ChartData> {
  const response = await apiService.getApi().get(baseUrl, {
    params: {
      startDate: startOfMonth(startDate),
      endDate: endOfMonth(endDate),
    },
  });
  var treatedData = transformDataForChart(response.data);
  return treatedData;
}

export async function getReportProductsSold(
  startDate: Date,
  endDate: Date
): Promise<ChartData> {
  const response = await apiService.getApi().get(`${baseUrl}/productssold`, {
    params: {
      startDate: startOfMonth(startDate),
      endDate: endOfMonth(endDate),
    },
  });
  var treatedData = transformDataForChart(response.data);
  return treatedData;
}

export async function getIncomeReport(
  startDate: Date,
  endDate: Date
): Promise<ChartData> {
  const response = await apiService.getApi().get(`${baseUrl}/incomeReport`, {
    params: {
      startDate: startOfMonth(startDate),
      endDate: endOfMonth(endDate),
    },
  });
  var treatedData = transformDataForChart(response.data, Charts.income);
  return treatedData;
}

export async function getIncomeByProductReport(
  startDate: Date,
  endDate: Date
): Promise<ChartData> {
  const response = await apiService
    .getApi()
    .get(`${baseUrl}/incomeByProducts`, {
      params: {
        startDate: startOfMonth(startDate),
        endDate: endOfMonth(endDate),
      },
    });
  var treatedData = transformDataForChart(response.data, Charts.income);
  return treatedData;
}
