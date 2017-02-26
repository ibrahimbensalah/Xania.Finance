﻿import { ForEach, query } from "../src/xania"
import './grid.css'

export default class DataGrid {
    private data = [];
    private columns = [];
    private activeRow = null;
    private activeRecord = null;

    constructor() {
        this.columns.push({ field: "name" });
        this.columns.push({ field: "email" });
        this.columns.push({ field: "roles" });

        // EmailConfirmed
    }

    onRowClick = (event, context) => {
        var activeRow = context.get('row').valueOf();
        this.activeRow = activeRow;
        this.activeRecord = activeRow.data;
        event.preventDefault();
    };

    cellValue(row, column) {
        return row[column.field];
    }

    view(xania) {
        return (
            <div id="users" data-modelid="Id" className="xn-grid" role="grid" data-itemheight="31">
                <div className="xn-border-box xn-grid-header" style="z-index: 100">
                    <div role="rowheader" className="xn-grid-row-header xn-grid-header-cell">&nbsp;</div>
                    <ForEach expr={query("for column in columns")}>
                        <div data-idx="UserName" role="gridcell" className="xn-grid-header-cell">
                            <div className="xn-grid-cell-content"><a data-bind="click: sort.bind($data, 'UserName')">{query("column.field")}</a></div>
                        </div>
                    </ForEach>
                    <div className="xn-grid-header-cell" style="width: 100%; min-width: 100px">&nbsp;</div>
                </div>

                <div className="xn-list-scrollable" style="overflow: auto; height: 100%;" role="listbox">
                    <div className="xn-content" style="padding-top: 0px; ">
                        <table style="width: 100%;">
                            <tbody data-bind="foreach: view">
                                <ForEach expr={query("for row in data")}>
                                    <tr role="listitem"
                                        onClick={this.onRowClick}
                                        className={["xn-list-item", query("row = activeRow -> ' xn-grid-row-activated'"),
                                                query("row.alternate -> ' xn-grid-row-alternate'"), query("row.updated -> ' xn-grid-row-updated'")]}>
                                        <td>
                                            <div className="xn-grid-row-header">
                                                <span className={["fa", query("row = activeRow -> ' fa-edit'")]}></span>
                                            </div>
                                        </td>
                                        <ForEach expr={query("for column in columns")}>
                                            <td role="gridcell" tabindex="-1" className="xn-grid-cell">
                                                <div className="xn-grid-cell-content"><a href="#">{query("cellValue row column")}</a></div>
                                            </td>
                                        </ForEach>
                                        <td role="gridcell" tabindex="-1" className="xn-grid-cell" style="width: 100%;"></td>
                                    </tr>
                                </ForEach>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export function bla() { }