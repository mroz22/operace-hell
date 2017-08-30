import React from "react";
import ReactTable from "react-table";
import 'react-table/react-table.css'

class Table extends React.Component {
  constructor(data, columns, showPagination) {
    super();
    this.state = {
      data: data,
      columns: columns,
      showPagination: showPagination
    };
  }
  render() {
    const data = this.props.data;
    const columns = this.props.columns;
    return (
    <div>
      <ReactTable
      showPagination={this.props.showPagination}
      data={data}
      columns={columns}
      defaultPageSize={data.length}
      className="-striped -highlight"
      />

    </div>
    );
  }
}

export default Table