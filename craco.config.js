const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#E93323' ,
                            '@border-radius-base': '5px',
                            '@table-border-color' : '#3D1E1E',
                            '@table-header-bg' : '#B7241F',
                            '@table-header-color' : '#141414',
                            '@table-body-sort-bg' : '#141414',
                            '@table-header-sort-bg' : '#E93323'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};

//#492021
