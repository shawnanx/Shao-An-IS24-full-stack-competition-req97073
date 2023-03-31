<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mb-sm bg-primary text-white"
      label="Add"
      @click="openEditDialog(newProduct)"
    />
    <q-table
      flat bordered
      title="Products"
      :rows="rows"
      :columns="columns"
      row-key="productId"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="productId" :props="props">
            {{ props.row.productId }}
          </q-td>
          <q-td key="productName" :props="props">
            {{ props.row.productName }}
          </q-td>
          <q-td key="productOwnerName" :props="props">
            {{ props.row.productOwnerName }}
          </q-td>
          <q-td key="Developers" :props="props">
            <div class="text-pre-wrap">
              {{ props.row.Developers }}
            </div>
          </q-td>
          <q-td key="scrumMasterName" :props="props">
            {{ props.row.scrumMasterName }}
          </q-td>
          <q-td key="startDate" :props="props">{{ props.row.startDate }}</q-td>
          <q-td key="methodology" :props="props">
            {{ props.row.methodology }}
          </q-td>
          <q-td :key="`${props.index}-actions`">
            <q-btn icon="edit" color="primary" @click="openEditDialog(props.row)" />
            <q-btn icon="delete" color="negative" @click="openDeleteDialog(props.row)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <!-- Edit Dialog -->
  <q-dialog v-model="editDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{selected.productId ? 'Edit' : 'Add'}}</div>
      </q-card-section>
      <q-card-section class="q-px-md">
        <q-input v-if="selected.productId" v-model="selected.productId" label="Product ID" dense disable />
        <q-input v-model="selected.productName" label="Product Name" dense />
        <q-input v-model="selected.productOwnerName" label="Owner Name" dense />
        <q-input v-model="selected.Developers" label="Developers" dense />
        <q-input v-model="selected.scrumMasterName" label="Scrum Master" dense />
        <q-date v-model="selected.startDate" title="Start Date"/>
        <q-option-group v-model="selected.methodology" :options="methodologyOptions" color="primary" inline dense />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />

        <q-btn
          v-if="selected.productId"
          flat
          label="Confirm"
          @click="editProduct(selected)"
          v-close-popup
        />
        <q-btn
          v-else
          flat
          label="Confirm"
          @click="addProduct(selected)"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Delete Dialog -->
  <q-dialog v-model="deleteDialog" @hide="resetSelected()" >
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Are you sure to delete ?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Confirm" color="negative" @click="deleteProduct(selected.productId)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      columns: [
        {
          name: "productId",
          required: true,
          label: "Product ID",
          align: "left",
          field: "productId",
          sortable: true,
        },
        {
          name: "productName",
          required: true,
          label: "Product Name",
          align: "left",
          field: "productName",
          sortable: true,
        },
        {
          name: "productOwnerName",
          required: true,
          label: "Product Owner Name",
          align: "left",
          field: "productOwnerName",
          sortable: true,
        },
        {
          name: "Developers",
          required: true,
          label: "Developers",
          align: "left",
          field: "Developers",
          sortable: true,
        },
        {
          name: "scrumMasterName",
          required: true,
          label: "Scrum Master Name",
          align: "left",
          field: "scrumMasterName",
          sortable: true,
        },
        {
          name: "startDate",
          required: true,
          label: "Start Date",
          align: "left",
          field: "startDate",
          sortable: true,
        },
        {
          name: "methodology",
          required: true,
          label: "Methodology",
          align: "left",
          field: "methodology",
          sortable: true,
        },
        {
          name: "actions",
          label: "Actions",
          align: "left",
          field: "actions",
        },
      ],
      rows: [],
      methodologyOptions: [
        {
          label: 'Waterfall',
          value: 'Waterfall'
        },
        {
          label: 'Agile',
          value: 'Agile'
        }
      ],
      editDialog: false,
      deleteDialog: false,
      selected : null,
    };
  },

  methods: {
    validateProduct(p) {
      if (!p.productName) { alert("Invalid Product Name"); return false}
      if (!p.productOwnerName) { alert("Invalid Product Owner Name"); return false}
      if (!p.Developers) { alert("Invalid Developers"); return false}
      if (!p.scrumMasterName) { alert("Invalid Scrum Master Name"); return false}
      if (!p.startDate) { alert("Invalid Start Date"); return false}
      if (!p.methodology) { alert("Invalid Methodology"); return false}
      return true;
    },

    getProduct() {
      axios.get("http://localhost:3000/api/products")
      .then((response) => {
        this.rows = response.data;
        this.rows.map(e => e.Developers = e.Developers.join(','));
      })
      .catch((error) => {
        console.log(error);
      });
    },

    addProduct(product) {
      console.log("addProduct " + product.productName);
      product.Developers = product.Developers.split(','); // need to convert string to []
      if (!this.validateProduct(product)) return;
      axios.post('http://localhost:3000/api/products/', product)
      .then((response) => {
        this.getProduct();
      })
      .catch((error) => {
        console.log(error);
      });
    },

    editProduct(product) {
      console.log("editProduct " + product.productName);
      product.Developers = product.Developers.split(','); // need to convert string to []
      if (!this.validateProduct(product)) return;
      axios.put(`http://localhost:3000/api/products/${product.productId}`, product)
      .then((response) => {
        this.getProduct();
      })
      .catch((error) => {
        console.log(error);
      });
    },

    deleteProduct(id) {
      axios.delete(`http://localhost:3000/api/products/${id}`)
      .then((response) => {
        this.getProduct();
      })
      .catch((error) => {
        console.log(error);
      });
    },
    openEditDialog(row) {
      this.editDialog = true;
      this.selected = row ??
        {
          productName:'',
          productOwnerName:'',
          Developers:'',
          scrumMasterName:'',
          startDate:'',
          methodology:''
        };
    },
    openDeleteDialog(row) {
      this.deleteDialog = true;
      this.selected = row;
    },
    resetSelected() {
      this.selected = null;
    }
  },
  mounted() {
    this.getProduct();
  }
};
</script>
