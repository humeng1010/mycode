// import最后都会被替换为commonJS规范的
import { defineConfig } from 'vite'
/* 插件 */
// 引入别名自动配置
import { ViteAliases } from 'vite-aliases'
// 引入创建html插件
import { createHtmlPlugin } from 'vite-plugin-html'
// 引入vite-plugin-mock插件
import { viteMockServe } from 'vite-plugin-mock'
// 引入postcss预处理环境
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');
// 基础配置
export default defineConfig({
    // 借助插件自动生成
    /* resolve: {
        // 配置路径别名,方便深层次的文件引用外部的资源
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets")
        }
    }, */
    // 依赖预构建
    optimizeDeps: {
        exclude: []
    },
    // 环境变量前缀
    envPrefix: "ENV_",
    // 环境变量文件路径,一般与配置文件平级
    envDir: "./",
    // 对css的行为进行配置
    css: {
        // 是对css模块化的默认行为进行覆盖
        modules: {
            // 修改生成的配置对象的key的形式
            localsConvention: "dashesOnly",
            scopeBehaviour: "local",
            // generateScopedName: "[name]_[local]_[hash:5]"
            // hashPrefix: "hello"
            // globalModulePaths: [],//代表不想参与css模块化的路径
        },
        // 执行编译css文件的执行参数
        preprocessorOptions: {//key+value
            less: { // 整个的配置对象都会给到less的执行参数(全局参数)中去
                math: "always",
                // 配置全局变量
                globalVars: {
                    "main-color": "red",
                    "color-content": "pink"
                }
            },
        },
        devSourcemap: true,//开启css的sourcemap
        // vite的诞生会让postcss再火一次
        postcss: {
            plugins: [postcssPresetEnv({
                // 让postcss能够保留一些全局变量,可以提供后面的文件使用
                importFrom: path.resolve(__dirname, "./variable.css"),
            })]
        }
    },
    // 构建生产包的时候的一些策略
    build: {
        // 配置rollup的一些构建策略
        rollupOptions: {
            output: {// 控制输出
                // 在rollup里面, hash代表的是你的文件名和文件内容进行组合计算得来的结果
                assetFileNames: "[hash].[name].[ext]",
            },

        },
        // assetsInlineLimit: 4096, // 4kb 如果静态资源小于4kb则会转换为base64的格式
        // outDir: "build",//配置打包的文件名称
        assetsDir: "static",// 配置打包后静态资源的目录
    },
    // 配置插件
    plugins: [
        // 自动生成路径别名的插件
        ViteAliases(),
        // 配置生成的html文件
        createHtmlPlugin({
            inject: {
                data: {
                    title: "首页"
                },
            },
        }),
        // 开箱即用,自动寻找根目录的mock文件夹
        viteMockServe({
            // 配置mock的文件夹位置
            mockPath: "/src/mock"
        })
    ],
}
)
