<template>
    <div>
        <!--        <avue-form ref="request" :option="requestOption" v-model="request" @submit="handleSubmit">-->
        <!--        </avue-form>-->
        <avue-crud :data="data" :option="requestOption" @row-save="handleRowSave" v-model="request"></avue-crud>
    </div>
</template>

<script>
import axios from 'axios';

const DIC = {
  VERB: [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'OPTIONS', value: 'OPTIONS' },
  ],
  STATUS: [
    { 'value': '100', 'label': '100 - Continue' },
    { 'value': '101', 'label': '101 - Switching Protocols' },
    { 'value': '102', 'label': '102 - Processing' },
    { 'value': '200', 'label': '200 - OK' },
    { 'value': '201', 'label': '201 - Created' },
    { 'value': '202', 'label': '202 - Accepted' },
    { 'value': '203', 'label': '203 - Non-Authoritative Information' },
    { 'value': '204', 'label': '204 - No Content' },
    { 'value': '205', 'label': '205 - Reset Content' },
    { 'value': '206', 'label': '206 - Partial Content' },
    { 'value': '207', 'label': '207 - Multi-Status' },
    { 'value': '208', 'label': '208 - Already Reported' },
    { 'value': '226', 'label': '226 - IM Used' },
    { 'value': '300', 'label': '300 - Multiple Choices' },
    { 'value': '301', 'label': '301 - Moved Permanently' },
    { 'value': '302', 'label': '302 - Found' },
    { 'value': '303', 'label': '303 - See Other' },
    { 'value': '304', 'label': '304 - Not Modified' },
    { 'value': '305', 'label': '305 - Use Proxy' },
    { 'value': '306', 'label': '306 - Switch Proxy' },
    { 'value': '307', 'label': '307 - Temporary Redirect' },
    { 'value': '308', 'label': '308 - Permanent Redirect' },
    { 'value': '400', 'label': '400 - Bad Request' },
    { 'value': '401', 'label': '401 - Unauthorized' },
    { 'value': '402', 'label': '402 - Payment Required' },
    { 'value': '403', 'label': '403 - Forbidden' },
    { 'value': '404', 'label': '404 - Not Found' },
    { 'value': '405', 'label': '405 - Method Not Allowed' },
    { 'value': '406', 'label': '406 - Not Acceptable' },
    { 'value': '407', 'label': '407 - Proxy Authentication Required' },
    { 'value': '408', 'label': '408 - Request Timeout' },
    { 'value': '409', 'label': '409 - Conflict' },
    { 'value': '410', 'label': '410 - Gone' },
    { 'value': '411', 'label': '411 - Length Required' },
    { 'value': '412', 'label': '412 - Precondition Failed' },
    { 'value': '413', 'label': '413 - Request Entity Too Large' },
    { 'value': '414', 'label': '414 - Request-URI Too Long' },
    { 'value': '415', 'label': '415 - Unsupported Media Type' },
    { 'value': '416', 'label': '416 - Requested Range Not Satisfiable' },
    { 'value': '417', 'label': '417 - Expectation Failed' },
    { 'value': '419', 'label': '419 - Authentication Timeout' },
    { 'value': '420', 'label': '420 - Enhance Your Calm' },
    { 'value': '422', 'label': '422 - Unprocessable Entity' },
    { 'value': '423', 'label': '423 - Locked' },
    { 'value': '424', 'label': '424 - Failed Dependency' },
    { 'value': '424', 'label': '424 - Method Failure' },
    { 'value': '426', 'label': '426 - Upgrade Required' },
    { 'value': '428', 'label': '428 - Precondition Required' },
    { 'value': '429', 'label': '429 - Too Many Requests' },
    { 'value': '431', 'label': '431 - Request Header Fields Too Large' },
    { 'value': '444', 'label': '444 - No Response' },
    { 'value': '449', 'label': '449 - Retry With' },
    { 'value': '450', 'label': '450 - Blocked by Windows Parental\n\t\t\t\t\tControls' },
    { 'value': '451', 'label': '451 - Unavailable For Legal Reasons' },
    { 'value': '451', 'label': '451 - Redirect' },
    { 'value': '494', 'label': '494 - Request Header Too Large' },
    { 'value': '495', 'label': '495 - Cert Error' },
    { 'value': '496', 'label': '496 - No Cert' },
    { 'value': '497', 'label': '497 - HTTP to HTTPS' },
    { 'value': '500', 'label': '500 - Internal Server Error' },
    { 'value': '501', 'label': '501 - Not Implemented' },
    { 'value': '502', 'label': '502 - Bad Gateway' },
    { 'value': '503', 'label': '503 - Service Unavailable' },
    { 'value': '504', 'label': '504 - Gateway Timeout' },
    { 'value': '505', 'label': '505 - HTTP Version Not Supported' },
    { 'value': '506', 'label': '506 - Variant Also Negotiates' },
    { 'value': '507', 'label': '507 - Insufficient Storage' },
    { 'value': '508', 'label': '508 - Loop Detected' },
    { 'value': '509', 'label': '509 - Bandwidth Limit Exceeded' },
    { 'value': '510', 'label': '510 - Not Extended' },
    { 'value': '511', 'label': '511 - Network Authentication Required' }
  ],
//   application/json
// application/xml
// text/xml
// text/json
// text/plain
// Other

  CONTENT: [
    {
      label: 'application/json',
      value: 'application/json'
    },
    {
      label: 'application/xml',
      value: 'application/xml'
    },
    {
      label: 'text/xml',
      value: 'text/xml'
    },
    {
      label: 'text/json',
      value: 'text/json'
    },
    {
      label: 'text/plain',
      value: 'text/plain'
    },
    {
      label: 'Other',
      value: ''
    },
  ]
};

export default {
  name: 'App',
  components: {},
  data() {
    return {
      request: {
        verb: 'GET',
        path: 'test/',
        status: '200',
        'Content-Encoding': 'UTF-8',
        'Content-Type': 'application/json',
        content: 'application/json',
        body: '{"msg": "auth"}'
      },
      headers: {},
      body: {},
      data: []
    };
  },
  methods: {
    handleSubmit(form, done) {
      this.$message.success(JSON.stringify(form));
      axios.post('/response', this.request).then(res => {
        console.log(res);
      }).finally(() => {
        done();
      });
    },
    handleRowSave(form, done) {
      this.$message.success(JSON.stringify(form));
      axios.post('/response', this.request).then(res => {
        console.log(res);
      }).finally(() => {
        done();
      });
    },
  },
  computed: {
    requestOption() {
      return {
        mock: true,
        submitText: '完成',
        labelWidth: 200,
        column: [
          {
            label: 'Path',
            span: 12,
            prop: 'path',
            prepend: 'http://',
            mock: {
              type: 'url',
              header: false,
            },
            row: true,
          },
          {
            label: 'Verb',
            prop: 'verb',
            type: 'radio',
            dicData: DIC.VERB,
            row: true,
            mock: {
              type: 'dic'
            },
            // change:({value,column})=>{
            //   this.$message.success('change')
            // }
          },
          {
            label: 'Response status',
            prop: 'status',
            span: 12,
            type: 'select',
            dicData: DIC.STATUS,
            row: true,
            mock: {
              type: 'dic',
            },
          },
          {
            label: 'Content-Type',
            prop: 'Content-Type',
            span: 12,
            type: 'select',
            dicData: DIC.CONTENT,
            mock: {
              type: 'dic',
            },
            row: true,
            change: ({ value, column }) => {
              this.request.type = value;
              this.request.content = '';
            },
          },
          {
            label: '',
            prop: 'type',
            span: 12,
            row: true,
            type: 'text',
          },
          {
            label: 'Content-Encoding',
            prop: 'Content-Encoding',
            span: 12,
            row: true,
            type: 'text',
          },
          {
            label: 'Response body',
            prop: 'body',
            span: 12,
            row: true,
            type: 'textarea',
          },
        ]
      };
    }
  },
  mounted() {
    axios.get('/response').then(res => {
      this.data = res.data;
    });
  }
};
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
