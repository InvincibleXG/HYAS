package com.xg.hyas.util;

import com.xg.hyas.vo.AttendanceView;
import com.xg.hyas.vo.WorkView;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFFont;

import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SummaryUtil
{
    /**
     *  计算列表中所有的考勤总计小时数
     * @param attendanceViewList
     * @return
     */
    public static double totalAttendanceHours(List<AttendanceView> attendanceViewList)
    {
        double total=0;
        for (AttendanceView attendanceView:attendanceViewList){
            String loginTime=attendanceView.getLoginTime();
            String logoutTime=attendanceView.getLogoutTime();
            try {
                Date startDate=FormatUtil.format2Date(loginTime, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                Date endDate=FormatUtil.format2Date(logoutTime, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                if (endDate==null){
                    Calendar endCalendar=Calendar.getInstance();
                    endCalendar.setTime(startDate);
                    endCalendar.set(Calendar.HOUR_OF_DAY, 17);
                    endCalendar.set(Calendar.MINUTE, 0);
                    endCalendar.set(Calendar.SECOND, 0);
                    endCalendar.set(Calendar.MILLISECOND, 0);
                    endDate=endCalendar.getTime();
                }
                long time=endDate.getTime()-startDate.getTime();
                total+=((double)time/1000/3600);
            } catch (Exception e) {
                log.error("转化日期出错", e);
            }
        }
        return total;
    }

    /**
     * 计算列表中所有的接单总计小时数  取消的订单不会统计时长
     * @param workViewList
     * @return
     */
    public static double totalWorkHours(List<WorkView> workViewList)
    {
        double total=0;
        for (WorkView workView:workViewList){
            Integer status=workView.getStatus();
            if (status==0) continue;
            String start=workView.getStartTime();
            String end=workView.getEndTime();
            try {
                Date startDate=FormatUtil.format2Date(start, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                Date endDate=FormatUtil.format2Date(end, FormatUtil.YYYY_MM_DD_HH_MM_SS);
                long time=endDate.getTime()-startDate.getTime();
                total+=((double)time/1000/3600);
            } catch (Exception e) {
                log.error("转化日期出错", e);
            }
        }
        return total;
    }

    /**
     *  导出考勤统计
     * @param outputStream
     * @param attendanceViewListMap
     * @throws IOException
     */
    public static void attendanceReport(OutputStream outputStream, Map<AttendanceView,List<AttendanceView>> attendanceViewListMap) throws IOException
    {
        SXSSFWorkbook wb = new SXSSFWorkbook();
        try {
            SXSSFSheet sheet = wb.createSheet("考勤统计报表");
            sheet.setDefaultRowHeight((short) (2 * 147));
            CellStyle cellStyle = wb.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            XSSFFont font = (XSSFFont) wb.createFont();
            font.setFontName("宋体");
            font.setBold(true);
            cellStyle.setFont(font);
            int rowCnt=0;
            int colCnt=0;
            SXSSFRow row = sheet.createRow(rowCnt++);
            row.setRowStyle(cellStyle);
            SXSSFCell cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("账号");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("姓名");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("上班时间");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("下班时间");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("总计考勤时长(h)");
            int columnLen=row.getPhysicalNumberOfCells();
            for (int i=0; i<columnLen; i++){
                sheet.setColumnWidth(i, 6000);
            }
            for (Map.Entry<AttendanceView, List<AttendanceView>> entry:attendanceViewListMap.entrySet()){
                AttendanceView key=entry.getKey();
                String id=key.getUserId();
                String name=key.getUserName();
                List<AttendanceView> attendanceViewList=entry.getValue();
                double totalHours=totalAttendanceHours(attendanceViewList); //获取总时长
                int rows=attendanceViewList.size();
                int startRow=rowCnt;
                int endRow=rows+startRow-1;
                for (AttendanceView attendanceView:attendanceViewList) {
                    row = sheet.getRow(rowCnt);
                    if (row == null) row = sheet.createRow(rowCnt);
                    cell=row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(attendanceView.getLoginTime());
                    cell=row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(attendanceView.getLogoutTime());
                    rowCnt++;
                }
                // 合并账号 姓名 总计上班时长 并写入第一个单元格
                if (endRow>startRow) {
                    CellRangeAddress idRange = new CellRangeAddress(startRow, endRow, 0, 0);
                    sheet.addMergedRegion(idRange);
                    CellRangeAddress nameRange = new CellRangeAddress(startRow, endRow, 1, 1);
                    sheet.addMergedRegion(nameRange);
                    CellRangeAddress totalRange = new CellRangeAddress(startRow, endRow, 4, 4);
                    sheet.addMergedRegion(totalRange);
                }
                Row rowTemp=sheet.getRow(startRow);
                Cell idCell=rowTemp.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                idCell.setCellValue(id);
                Cell nameCell=rowTemp.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                nameCell.setCellValue(name);
                Cell totalCell=rowTemp.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                totalCell.setCellValue(totalHours);
            }
            wb.write(outputStream);
        } catch (Exception e) {
            dealWithClientAbort(e);
        }finally {
            wb.close();
        }
    }

    /**
     *  导出接单统计
     * @param outputStream
     * @param workViewListMap
     * @throws IOException
     */
    public static void workReport(OutputStream outputStream, Map<WorkView,List<WorkView>> workViewListMap) throws IOException
    {
        SXSSFWorkbook wb = new SXSSFWorkbook();
        try {
            SXSSFSheet sheet = wb.createSheet("绩效统计报表");
            sheet.setDefaultRowHeight((short) (2 * 147));
            CellStyle cellStyle = wb.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            XSSFFont font = (XSSFFont) wb.createFont();
            font.setFontName("宋体");
            font.setBold(true);
            cellStyle.setFont(font);
            int rowCnt=0;
            int colCnt=0;
            SXSSFRow row = sheet.createRow(rowCnt++);
            row.setRowStyle(cellStyle);
            SXSSFCell cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("账号");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("姓名");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("记录日期");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("接单起始时间");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("接单结束时间");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("总计接单时长(h)");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("订单状态");
            cell = row.createCell(colCnt++);
            cell.setCellStyle(cellStyle);
            cell.setCellValue("取消备注");
            int columnLen=row.getPhysicalNumberOfCells();
            for (int i=0; i<columnLen; i++){
                sheet.setColumnWidth(i, 6000);
            }
            for (Map.Entry<WorkView, List<WorkView>> entry:workViewListMap.entrySet()){
                WorkView key=entry.getKey();
                String id=key.getUserId();
                String name=key.getUserName();
                List<WorkView> workViewList=entry.getValue();
                double totalHours=totalWorkHours(workViewList); //获取总时长
                int rows=workViewList.size();
                int startRow=rowCnt;
                int endRow=rows+startRow-1;
                for (WorkView workView:workViewList) {
                    row = sheet.getRow(rowCnt);
                    if (row == null) row = sheet.createRow(rowCnt);
                    cell=row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(workView.getCreateTime().substring(0, 10));
                    cell=row.getCell(3, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(workView.getStartTime());
                    cell=row.getCell(4, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(workView.getEndTime());
                    cell=row.getCell(6, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(FormatUtil.workStatus(workView.getStatus()));
                    cell=row.getCell(7, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    cell.setCellValue(workView.getRemark());
                    rowCnt++;
                }
                // 合并账号 姓名 总计接单时长 并写入第一个单元格
                if (endRow>startRow) {
                    CellRangeAddress idRange = new CellRangeAddress(startRow, endRow, 0, 0);
                    sheet.addMergedRegion(idRange);
                    CellRangeAddress nameRange = new CellRangeAddress(startRow, endRow, 1, 1);
                    sheet.addMergedRegion(nameRange);
                    CellRangeAddress totalRange = new CellRangeAddress(startRow, endRow, 5, 5);
                    sheet.addMergedRegion(totalRange);
                }
                Row rowTemp=sheet.getRow(startRow);
                Cell idCell=rowTemp.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                idCell.setCellValue(id);
                Cell nameCell=rowTemp.getCell(1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                nameCell.setCellValue(name);
                Cell totalCell=rowTemp.getCell(5, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                totalCell.setCellValue(totalHours);
            }
            wb.write(outputStream);
        } catch (Exception e) {
            dealWithClientAbort(e);
        }finally {
            wb.close();
        }
    }

    protected static void dealWithClientAbort(Exception e)
    {
        Throwable t=e.getCause();
        String causeStr=e.getMessage();
        if (t!=null) {
            while (t.getCause() != null) {
                t = t.getCause();
            }
            causeStr = t.getMessage();
        }else{
            t=e;
        }
        if (causeStr!=null && (causeStr.contains("关闭了一个现有的连接") || causeStr.contains("软件中止了一个已建立的连接") || causeStr.contains("ClientAbort"))) return;
        log.error(t.toString(), t);
    }
}
