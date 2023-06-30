/**
 * 环境配置封装
 */
const env =
    import.meta.env.MODE || 'production';
const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/a282a286feeb75d8e18acff8895f948e/api'
    },
    test: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/a282a286feeb75d8e18acff8895f948e/api'
    },
    production: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/a282a286feeb75d8e18acff8895f948e/api'
    }
}
export default {
    env,
    mock: false,
    namespace: 'manager',
    ...EnvConfig[env]

}