<!-- 
    The component called by Add and Edit is the same, and only has address field.
    The data is passed to the component by the parent component.
    The component is a modal form controlled by visisble prop.
 -->
<template>
    <div class="add-token">
        <a-modal
        :title="title"
        :visible="visible"
        @cancel="onCancel"
        @ok="onOk"
        :confirm-loading="confirmLoading"
        >
        <a-form :form="form">
            <a-form-item label="Address">
            <a-input
                v-decorator="[
                'address',
                {
                    rules: [
                    { required: true, message: 'Please input your address!' },
                    ],
                },
                ]"
                placeholder="Address"
            />
            </a-form-item>
        </a-form>
        </a-modal>
    </div>
</template>


<script>
export default {
    name: 'AddToken',
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },

        onCancel: {
            type: Function,
            required: true,
        },
        onOk: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),
            confirmLoading: false,
        }
    },
}
</script>


<style scoped>
.add-token {
    width: 100%;
}

.add-token .ant-modal-body {
    padding: 24px 24px 0;
}

.add-token .ant-modal-footer {
    padding: 10px 24px 10px;
}

.add-token .ant-modal-footer .ant-btn {
    margin-right: 8px;
}

.add-token .ant-modal-footer .ant-btn:last-child {
    margin-right: 0;
}

.add-token .ant-modal-header {
    padding: 16px 24px;
}

.add-token .ant-modal-header .ant-modal-title {
    font-size: 16px;
    font-weight: 500;
}

.add-token .ant-modal-header .ant-modal-close-x {
    top: 16px;
    right: 16px;
}

.add-token .ant-modal-content {
    border-radius: 4px;
}

.add-token .ant-modal-content .ant-modal-body {
    padding: 24px 24px 0;
}

.add-token .ant-modal-content .ant-modal-footer {
    padding: 10px 24px 10px;
}
</style>