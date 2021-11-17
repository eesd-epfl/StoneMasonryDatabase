<template>
  <div></div>
</template>

<script>
//import XLSX from "xlsx";
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
export default {
  name: "ExcelFile",

  data: () => ({}),

  methods: {
    // onChange(event) {
    //   this.file = event.target.files ? event.target.files[0] : null;
    //   if (this.file) {
    //     const reader = new FileReader();

    //     reader.onload = (e) => {
    //       /* Parse data */
    //       const bstr = e.target.result;
    //       const wb = XLSX.read(bstr, { type: "binary" });
    //       /* Get first worksheet */
    //       const wsname = wb.SheetNames[0];
    //       const ws = wb.Sheets[wsname];
    //       /* Convert array of arrays */
    //       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    //     };

    //     reader.readAsBinaryString(this.file);
    //   }
    },
  },
};
</script>
