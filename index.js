// Import stylesheets
import "./style.css";
import "ag-grid-autocomplete-editor/dist/main.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AutocompleteSelectCellEditor } from "ag-grid-autocomplete-editor";
import { Grid } from "ag-grid-community";

const selectData = [
  { value: 0, label: "this" },
  { value: 1, label: "is" },
  { value: 2, label: "sparta" },
  { value: 3, label: "yolo" },
  { value: 4, label: "yoloooooo" },
  { value: 5, label: "yola" },
  { value: 6, label: "yoli" },
  { value: 7, label: "yolu" },
  { value: 8, label: "yolp" },
  { value: 9, label: "yolop" },
  { value: 10, label: "yolpo" },
  { value: 11, label: "yolui" },
  { value: 12, label: "yolqw" },
  { value: 13, label: "yolxz" },
  { value: 14, label: "yolcv" },
  { value: 15, label: "yolbn" }
];
const rowDatas = [
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null },
  { make: null, model: null, price: null, country: null, city: null }
];
const columnDefs = [
  {
    headerName: "Already present data selector",
    field: "make",
    cellEditor: AutocompleteSelectCellEditor,
    cellEditorParams: {
      required: true,
      selectData: selectData,
      placeholder: "Select an option"
    },
    valueFormatter: params => {
      if (params.value) {
        return params.value.label || params.value.value || params.value;
      }
      return "";
    },
    editable: true
  },
  {
    headerName: "Model",
    field: "model",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: selectData.map(d => d.label)
    },
    editable: true
  },
  {
    headerName: "Price",
    field: "price",
    editable: true
  },
  {
    headerName: "Ajax country request",
    field: "country",
    cellEditor: AutocompleteSelectCellEditor,
    cellEditorParams: {
      autocomplete: {
        fetch: (cellEditor, text, update) => {
          console.log(cellEditor);
          let match =
            text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
          let xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
              let data = JSON.parse(xmlHttp.responseText);
              let items = data.map(d => ({
                value: d.numericCode,
                label: d.name,
                group: d.region
              }));
              update(items);
            }
            if (xmlHttp.status === 404) {
              update(false);
            }
          };
          xmlHttp.open(
            "GET",
            `https://restcountries.eu/rest/v2/name/${match}`,
            true
          );
          xmlHttp.send(null);
        }
      },
      placeholder: "Select a country"
    },
    valueFormatter: params => {
      if (params.value) {
        return params.value.label || params.value.value || params.value;
      }
      return "";
    },
    editable: true
  },
  {
    headerName: "Capital slow request with spinner",
    field: "city",
    cellEditor: AutocompleteSelectCellEditor,
    cellEditorParams: {
      autocomplete: {
        fetch: (cellEditor, text, update) => {
          let spinnertimeout;
          let match =
            text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
          let spinner = document.createElement("i");
          spinner.className = "ag-cell-editor-autocomplete-spinner";
          let editor = document.getElementsByClassName("autocomplete")[0];
          console.log("editor: ", editor);
          if (editor && !editor.querySelector("i")) {
            spinnertimeout = setTimeout(() => editor.prepend(spinner), 200);
          }
          let xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = () => {
            clearTimeout(spinnertimeout);
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
              let data = JSON.parse(xmlHttp.responseText);
              let items = data.map(d => ({
                value: d.capital,
                label: d.capital
              }));
              update(items);
            }
            if (xmlHttp.status === 404) {
              update(false);
            }
          };
          setTimeout(() => {
            xmlHttp.open(
              "GET",
              `https://restcountries.eu/rest/v2/capital/${match}`,
              true
            );
            xmlHttp.send(null);
          }, 500);
        }
      },
      placeholder: "Select a capital"
    },
    valueFormatter: params => {
      if (params.value) {
        return params.value.label || params.value.value || params.value;
      }
      return "";
    },
    editable: true
  }
];
const gridOptions = {
  columnDefs: columnDefs,
  rowData: rowDatas,
  suppressScrollOnNewData: false
};
let eGridDiv = document.querySelector("#myGrid");
new Grid(eGridDiv, gridOptions);
