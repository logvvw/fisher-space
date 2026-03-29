<template>
  <div class="user-manage-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="text-gradient">用户管理</h2>
        <p class="subtitle">管理系统访问权限与人员账号信息</p>
      </div>
      <a-button type="primary" class="add-btn" @click="handleAdd">
        <template #icon><plus-outlined /></template>
        新增用户
      </a-button>
    </div>

    <!-- Search & Filter -->
    <div class="filter-section glass-panel">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="输入用户名搜索..."
        style="width: 300px"
        @search="onSearch"
      />
    </div>

    <!-- User Table -->
    <div class="table-container glass-panel">
      <a-table 
        :columns="columns" 
        :data-source="userList" 
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ record.role }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge :status="record.status === 'active' ? 'success' : 'error'" :text="record.status === 'active' ? '正常' : '禁用'" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除该用户吗？"
                @confirm="confirmDelete(record.id)"
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
      v-model:visible="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
      class="admin-modal"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
              label="用户名" 
              name="username" 
              :rules="[{ required: true, message: '请输入用户名' }]"
            >
              <a-input v-model:value="formState.username" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item 
              label="密码" 
              name="password" 
              :rules="[{ required: !isEdit, message: '请输入密码' }]"
            >
              <a-input-password v-model:value="formState.password" :placeholder="isEdit ? '不填则保持不变' : '请输入登录密码'" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="formState.nickname" placeholder="留空则系统自动分配" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="formState.phone" placeholder="请输入手机号码" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="角色" name="role">
              <a-select v-model:value="formState.role">
                <a-select-option value="super_admin">超级管理员</a-select-option>
                <a-select-option value="venue_admin">钓场管理员</a-select-option>
                <a-select-option value="angler">普通钓客</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-radio-group v-model:value="formState.status">
                <a-radio value="active">启用</a-radio>
                <a-radio value="banned">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api';

const loading = ref(false);
const userList = ref([]);
const searchQuery = ref('');
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', customRender: ({ text }: any) => (text || '').slice(0, 10) },
  { title: '操作', key: 'action', width: 150 },
];

const loadUsers = async () => {
  loading.value = true;
  try {
    const res: any = await fetchUsers({
      page: pagination.current,
      limit: pagination.pageSize,
      username: searchQuery.value,
    });
    userList.value = res.data;
    pagination.total = res.total;
  } catch (err) {
    message.error('加载用户列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  loadUsers();
};

const onSearch = () => {
  pagination.current = 1;
  loadUsers();
};

// Modal Logic
const modalVisible = ref(false);
const isEdit = ref(false);
const modalLoading = ref(false);
const formRef = ref();
const formState = reactive({
  id: undefined,
  username: '',
  password: '',
  nickname: '',
  phone: '',
  role: 'angler',
  status: 'active',
});

const handleAdd = () => {
  isEdit.value = false;
  Object.assign(formState, {
    id: undefined,
    username: '',
    password: '',
    nickname: '',
    phone: '',
    role: 'angler',
    status: 'active',
  });
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formState, {
    id: record.id,
    username: record.username,
    nickname: record.nickname || '',
    phone: record.phone || '',
    password: '',
    role: record.role,
    status: record.status,
  });
  modalVisible.value = true;
};

// 工具函数：生成指定长度的随机字母数字组合
const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    modalLoading.value = true;
    
    // 如果是新增且昵称为空，自动生成 8 位随机字符串
    if (!isEdit.value && !formState.nickname) {
      formState.nickname = generateRandomString(8);
    }
    
    if (isEdit.value) {
      const { id, ...data } = formState;
      const payload: any = { ...data };
      if (!payload.password) delete payload.password;
      await updateUser(id!, payload);
      message.success('更新用户成功');
    } else {
      await createUser(formState);
      message.success('创建用户成功');
    }
    modalVisible.value = false;
    loadUsers();
  } catch (err) {
    message.error('操作失败');
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async (id: number) => {
  try {
    await deleteUser(id);
    message.success('删除用户成功');
    loadUsers();
  } catch (err) {
    message.error('删除失败');
  }
};

const getRoleColor = (role: string) => {
  if (role === 'super_admin') return 'purple';
  if (role === 'venue_admin') return 'blue';
  return 'default';
};

onMounted(loadUsers);
</script>

<style scoped>
.user-manage-page {
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