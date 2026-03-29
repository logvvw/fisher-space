<template>
  <div class="glass-panel" style="padding: 24px;">
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="back-btn" @click="router.push('/fish-info')"><left-outlined /></div>
        <div>
          <h2 class="text-gradient">{{ isEdit ? '编辑鱼讯' : '发布鱼讯' }}</h2>
          <p class="subtitle">{{ isEdit ? '修改鱼情信息内容' : '发布最新鱼情，与钓友分享' }}</p>
        </div>
      </div>
    </div>

    <a-form :model="formState" layout="vertical" ref="formRef" style="max-width: 700px;">
      <a-form-item label="关联钓场" name="venueId" :rules="[{ required: true, message: '请选择钓场' }]">
        <a-select v-model:value="formState.venueId" placeholder="请选择钓场" show-search :filter-option="(input: string, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())">
          <a-select-option v-for="v in venueOptions" :key="v.value" :value="v.value">{{ v.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="鱼讯内容" name="content" :rules="[{ required: true, message: '请输入鱼讯内容' }]">
        <a-textarea v-model:value="formState.content" placeholder="描述当前鱼情，如：今日鲫鱼开口极佳，饵料建议偏腥香..." :rows="5" />
      </a-form-item>

      <a-form-item label="咬钩热度" name="biteRate">
        <a-select v-model:value="formState.biteRate" placeholder="请选择咬钩热度（可选）" allow-clear>
          <a-select-option value="高">高 🔥</a-select-option>
          <a-select-option value="中">中</a-select-option>
          <a-select-option value="低">低</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="垂钓须知" name="rules">
        <a-textarea v-model:value="formState.rules" placeholder="填写垂钓注意事项（可选）" :rows="3" />
      </a-form-item>

      <a-form-item label="图片链接" name="images">
        <a-input v-model:value="formState.imagesRaw" placeholder="输入图片URL，多个用英文逗号分隔（可选）" />
      </a-form-item>
      <div v-if="imagePreviews.length" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: -8px;">
        <img v-for="(url, idx) in imagePreviews" :key="idx" :src="url" style="width: 100px; height: 70px; object-fit: cover; border-radius: 8px;" />
      </div>

      <a-form-item>
        <a-button type="primary" @click="handleSubmit" :loading="submitLoading" size="large">
          {{ isEdit ? '保存修改' : '发布鱼讯' }}
        </a-button>
        <a-button style="margin-left: 12px;" @click="router.push('/fish-info')">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { fetchVenues, fetchFishInfos, createFishInfo, updateFishInfo } from '@/api';

const router = useRouter();
const route = useRoute();
const isEdit = computed(() => !!route.query.id);
const submitLoading = ref(false);
const venueOptions = ref<{ label: string; value: number }[]>([]);
const formRef = ref();

const formState = reactive({
  venueId: undefined as number | undefined,
  content: '',
  biteRate: '',
  rules: '',
  imagesRaw: '',
});

const imagePreviews = computed(() => {
  if (!formState.imagesRaw) return [];
  return formState.imagesRaw.split(',').map(s => s.trim()).filter(Boolean);
});

const loadVenues = async () => {
  try {
    const res: any = await fetchVenues({ status: 'approved', pageSize: 500 });
    venueOptions.value = (res?.list || res || []).map((v: any) => ({ label: v.name, value: v.id }));
  } catch { /* silent */ }
};

const loadFishInfo = async (id: number) => {
  try {
    const res: any = await fetchFishInfos({ id });
    const info = Array.isArray(res) ? res[0] : res;
    if (info) {
      formState.venueId = info.venueId;
      formState.content = info.content || '';
      formState.biteRate = info.biteRate || '';
      formState.rules = info.rules || '';
      formState.imagesRaw = (info.images || []).join(', ');
    }
  } catch { /* silent */ }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    const images = imagePreviews.value.length ? imagePreviews.value : undefined;
    const payload: any = { venueId: formState.venueId, content: formState.content, biteRate: formState.biteRate || undefined, rules: formState.rules || undefined };
    if (images) payload.images = images;
    if (isEdit.value && route.query.id) {
      await updateFishInfo(Number(route.query.id), payload);
      message.success('保存成功');
    } else {
      await createFishInfo(payload);
      message.success('发布成功');
    }
    router.push('/fish-info');
  } catch {
    message.error('操作失败，请检查输入');
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  loadVenues();
  if (isEdit.value && route.query.id) {
    loadFishInfo(Number(route.query.id));
  }
});
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.subtitle { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
.back-btn { font-size: 20px; color: #fff; cursor: pointer; padding: 4px; }
</style>