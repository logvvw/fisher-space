<template>
  <div class="venue-manage-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="text-gradient">钓场管理</h2>
        <p class="subtitle">全面管理全国各地钓场的信息与状态</p>
      </div>
      <a-button type="primary" class="add-btn" @click="showAddModal">
        <template #icon><plus-outlined /></template>
        新增钓场
      </a-button>
    </div>

    <!-- Search & Filter -->
    <div class="filter-section glass-panel">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="输入钓场名称进行检索..."
        style="width: 320px"
        @search="loadData"
      />
    </div>

    <!-- Table Container -->
    <div class="table-container glass-panel">
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'facilities'">
            <a-space>
              <a-tag v-for="(facility, index) in parseFacilities(record.facilities)" :key="index" color="blue">
                {{ facility }}
              </a-tag>
            </a-space>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="showEditModal(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要永久删除这个钓场吗？"
                @confirm="handleDelete(record.id)"
                ok-text="确定"
                cancel-text="取消"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑钓场信息' : '新增入驻钓场'"
      width="700px"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      class="admin-modal"
    >
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="钓场名称" name="name" :rules="[{ required: true, message: '请输入钓场名称' }]">
              <a-input v-model:value="formData.name" placeholder="请输入钓场名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所在地区" name="regionIds" :rules="[{ required: true, message: '请选择省市区' }]">
              <a-cascader
                v-model:value="formData.regionIds"
                :options="regionData"
                placeholder="请选择省/市/区"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="详细地址" name="address">
              <a-input v-model:value="formData.address" placeholder="请输入详细街道位置" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="营业时间" name="businessHoursRange">
              <a-time-range-picker
                v-model:value="formData.businessHoursRange"
                format="HH:mm"
                :placeholder="['开始时间', '结束时间']"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="面积(亩)" name="area">
              <a-input-number v-model:value="formData.area" :min="0" style="width: 100%" placeholder="请输入面积数字" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="formData.phone" placeholder="格式：020-12345678" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="设施配套" name="facilities">
          <a-checkbox-group v-model:value="formData.facilities">
            <a-checkbox value="停车场">停车场</a-checkbox>
            <a-checkbox value="餐饮">餐饮</a-checkbox>
            <a-checkbox value="住宿">住宿</a-checkbox>
            <a-checkbox value="渔具租赁">渔具租赁</a-checkbox>
            <a-checkbox value="wifi">WiFi</a-checkbox>
            <a-checkbox value="空调">空调</a-checkbox>
            <a-checkbox value="卫生间">卫生间</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="封面图片链接" name="coverImage">
          <div style="display: flex; gap: 16px; align-items: flex-start;">
            <a-input 
              v-model:value="formData.coverImage" 
              placeholder="请输入公网可访问的图片URL" 
              style="flex: 1;"
            />
            <div v-if="formData.coverImage" class="image-preview-wrapper">
              <a-image 
                :width="60" 
                :height="60" 
                :src="formData.coverImage" 
                fallback="https://via.placeholder.com/60?text=Err"
              />
            </div>
          </div>
        </a-form-item>

        <a-form-item label="综合简介" name="description">
          <a-textarea v-model:value="formData.description" :rows="3" placeholder="简要介绍钓场的特色与优势..." />
        </a-form-item>

        <a-form-item v-if="isEdit" label="运营状态" name="status">
          <a-select v-model:value="formData.status" style="width: 100%">
            <a-select-option value="approved">正常营业</a-select-option>
            <a-select-option value="offline">已下线屏蔽</a-select-option>
            <a-select-option value="pending">待审核确认</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { regionData, codeToText } from 'element-china-area-data';
import dayjs from 'dayjs';
import { fetchVenues, createVenue, updateVenue, deleteVenue } from '@/api';

const columns = [
  { title: '钓场名称', dataIndex: 'name', key: 'name' },
  { title: '省市区域', dataIndex: 'province', customRender: ({ record }: any) => `${record.province || ''} ${record.city || ''} ${record.district || ''}` },
  { title: '面积(亩)', dataIndex: 'area', key: 'area' },
  { title: '联系热线', dataIndex: 'phone', key: 'phone' },
  { title: '状态', key: 'status', width: 100 },
  { title: '支持设施', key: 'facilities', width: 200 },
  { title: '操作选项', key: 'action', width: 160 },
];

const data = ref<any[]>([]);
const loading = ref(false);
const searchKeyword = ref('');
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 解析设施字段
const parseFacilities = (facili: any) => {
  if (Array.isArray(facili)) return facili;
  if (typeof facili === 'string' && facili.trim() !== '') {
    try {
      const parsed = JSON.parse(facili);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return facili.split(',').filter((f: string) => f);
    }
  }
  return [];
};

// 弹窗相关
const modalVisible = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const formRef = ref();
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  regionIds: [] as string[],
  address: '',
  area: undefined as number | undefined,
  phone: '',
  businessHoursRange: null as any,
  facilities: [] as string[],
  coverImage: '',
  description: '',
  status: 'approved',
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res: any = await fetchVenues({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value,
    });
    data.value = res.list || [];
    pagination.total = res.total || 0;
  } catch (error) {
    message.error('由于网络异常，加载钓场列表受到影响');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadData();
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    approved: 'green',
    pending: 'orange',
    rejected: 'red',
    offline: 'default',
  };
  return map[status] || 'default';
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    approved: '营业中',
    pending: '待审核',
    rejected: '已拒绝',
    offline: '已下线',
  };
  return map[status] || status;
};

// 新增
const showAddModal = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: undefined,
    name: '',
    regionIds: [],
    address: '',
    area: undefined,
    phone: '',
    businessHoursRange: null,
    facilities: [],
    coverImage: '',
    description: '',
    status: 'approved',
  });
  modalVisible.value = true;
};

// 编辑
const showEditModal = (record: any) => {
  isEdit.value = true;

  // 将省市区文本转换为 regionIds
  const rIds: string[] = [];
  if (record.province) {
    const p = regionData.find((item: any) => item.label === record.province);
    if (p) {
      rIds.push(p.value);
      if (record.city && p.children) {
        const c = p.children.find((item: any) => item.label === record.city);
        if (c) {
          rIds.push(c.value);
          if (record.district && c.children) {
            const d = c.children.find((item: any) => item.label === record.district);
            if (d) rIds.push(d.value);
          }
        }
      }
    }
  }

  // 将字符串营业时间转换为范围 Picker 对象
  let bRange = null;
  if (record.businessHours && record.businessHours.includes('-')) {
    const [start, end] = record.businessHours.split('-');
    if (start && end) {
      bRange = [dayjs(start.trim(), 'HH:mm'), dayjs(end.trim(), 'HH:mm')];
    }
  }

  Object.assign(formData, {
    ...record,
    regionIds: rIds,
    businessHoursRange: bRange,
    facilities: parseFacilities(record.facilities),
  });
  modalVisible.value = true;
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    
    const submitData: any = { ...formData };

    // 转换地区级联数据为独立字段
    if (submitData.regionIds && submitData.regionIds.length > 0) {
      submitData.province = (codeToText as any)[submitData.regionIds[0]] || '';
      submitData.city = (codeToText as any)[submitData.regionIds[1]] || '';
      submitData.district = (codeToText as any)[submitData.regionIds[2]] || '';
    }
    delete submitData.regionIds;

    // 转换日期范围数据格式
    if (submitData.businessHoursRange && submitData.businessHoursRange.length === 2) {
      submitData.businessHours = `${submitData.businessHoursRange[0].format('HH:mm')}-${submitData.businessHoursRange[1].format('HH:mm')}`;
    } else {
      submitData.businessHours = '';
    }
    delete submitData.businessHoursRange;

    delete submitData.id;
    
    if (isEdit.value) {
      await updateVenue(formData.id!, submitData);
      message.success('修改钓场信息成功保存');
    } else {
      await createVenue(submitData);
      message.success('新增钓场已收录进系统');
    }
    modalVisible.value = false;
    loadData();
  } catch (error) {
    console.error('Submit Error:', error);
  } finally {
    submitLoading.value = false;
  }
};


const handleCancel = () => {
  modalVisible.value = false;
};

// 删除
const handleDelete = async (id: number) => {
  try {
    await deleteVenue(id);
    message.success('这条钓场记录已被安全移除');
    loadData();
  } catch (error) {
    message.error('该钓场当前状态受保护，可能无法被删除');
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.venue-manage-page {
  animation: fadeIn 0.5s ease-out;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.text-gradient {
  background: linear-gradient(135deg, #fff 0%, var(--admin-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-dim);
  font-size: 14px;
}

.add-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
}

.filter-section {
  padding: 16px 24px;
  margin-bottom: 24px;
  border-radius: 12px;
}

.table-container {
  padding: 12px;
  border-radius: 16px;
}

.image-preview-wrapper {
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: var(--admin-bg);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.image-preview-wrapper .ant-image-img) {
  object-fit: cover;
}

:deep(.ant-table) {
  background: transparent !important;
}

:deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0 0 !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>