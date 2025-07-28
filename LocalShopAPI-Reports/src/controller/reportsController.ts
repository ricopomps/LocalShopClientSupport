import { RequestHandler } from "express";
import { ReportService } from "../service/reportService";
import { assertIsDefined } from "../util/assertIsDefined";
import { encryptResponse } from "../middleware/encryptResponse";

const reportService = new ReportService();
export const getIncomeReport: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetReportQuery
> = async (req, res, next) => {
  try {
    const storeId = req.storeId;
    assertIsDefined(storeId);

    const { startDate, endDate } = req.query;
    const data = await reportService.getIncomeReport(
      startDate,
      endDate,
      req.token
    );
    res.status(200).json(encryptResponse(data));
  } catch (error) {
    next(error);
  }
};

export const getSoldProductsReport: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetReportQuery
> = async (req, res, next) => {
  try {
    const storeId = req.storeId;
    assertIsDefined(storeId);

    const { startDate, endDate } = req.query;
    await reportService.getSoldProductsReport(startDate, endDate, req.token);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

interface GetReportQuery {
  startDate: Date;
  endDate: Date;
}

export const getProductsSoldReport: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetReportQuery
> = async (req, res, next) => {
  try {
    const storeId = req.storeId;
    assertIsDefined(storeId);

    const { startDate, endDate } = req.query;

    const data = await reportService.getSoldProductsReport(
      startDate,
      endDate,
      req.token
    );

    res.status(200).json(encryptResponse(data));
  } catch (error) {
    next(error);
  }
};

export const getIncomeByProducts: RequestHandler<
  unknown,
  unknown,
  unknown,
  GetReportQuery
> = async (req, res, next) => {
  try {
    const storeId = req.storeId;
    assertIsDefined(storeId);

    const { startDate, endDate } = req.query;

    const data = await reportService.getIncomeByProducts(
      startDate,
      endDate,
      req.token
    );

    res.status(200).json(encryptResponse(data));
  } catch (error) {
    next(error);
  }
};
