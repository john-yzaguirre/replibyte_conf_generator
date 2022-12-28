const yaml = require('js-yaml');

function onlyTables() {
    return [
      {
        database: 'public',
        table: 'users'
      },
      {
        database: 'public',
        table: 'sales'
      }
    ];
  }

  // this is a passthrough table, it will be copied over entirely 100% to the target database
  function passthroughTables() {
    return ['sales'];
  }

  function databaseSubset() {
    return {
      database: 'public',
      table: 'users',
      strategy_name: 'random',
      strategy_options: {
        percent: 50
      },
      passthrough_tables: passthroughTables()
    };
  }
  

  function transformers() {
    return [
      {
        database: 'public',
        table: 'users',
        columns: [
          {
            name: 'first_name',
            transformer_name: 'first-name'
          },
          {
            name: 'email',
            transformer_name: 'email'
          },
          {
            name: 'event_json',
            transformer_name: 'custom-wasm',
            transformer_options: {
              path: 'C:\\Users\\John Yzaguirre\\Desktop\\tests\\replibyte\\json-first-name-key-changer\\target\\wasm32-wasi\\release\\json-first-name-key-changer.wasm'
            }
          }
        ]
      }
    ];
  }
  
  const conf = {
    encryption_key: 'supersecret',
    source: {
      connection_uri: 'postgres://postgres:password@localhost:5432/mysourcedb',
      only_tables: onlyTables(),
      database_subset: databaseSubset(),
      transformers: transformers()
    },
    datastore: {
      aws: {
        bucket: 'replibyte-masked-prod-data-dump',
        region: 'us-west-2',
        credentials: {
          access_key_id: '$AWS_ACCESS_KEY_ID',
          secret_access_key: '$AWS_SECRET_ACCESS_KEY'
        }
      }
    },
    destination: {
      connection_uri: 'postgres://postgres:password@localhost:5432/mytargetdb'
    }
  };
  

const confYaml = yaml.dump(conf);

console.log(confYaml);