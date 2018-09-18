// container
import DynamicWrapper from '../components/DynamicWrapper';

export default {
  path:  '/<%= fileName%>',
  menuCode: '', // 与后端接口返回的menuCode匹配，确认是否展示
  component: DynamicWrapper(() => import('../containers/<%= fileName%>')),
  routesName: '<%= moduleName%>',
};
