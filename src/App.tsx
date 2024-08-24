import './App.css';
import { bitable, ITableMeta, IFieldMeta, Selection, FieldType } from "@lark-base-open/js-sdk";
import { Button, Form } from '@douyinfe/semi-ui';
import { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Space } from '@douyinfe/semi-ui';
import './locales/i18n'; // 取消注释以启用国际化
import { genZodiacSign } from './genZodiacSign'

export default function App() {
  const { t, i18n } = useTranslation();
  const [tableMetaList, setTableMetaList] = useState<ITableMeta[]>();
  const [fieldMetaList, setFieldMetaList] = useState<IFieldMeta[]>();
  const [fieldValue, setFieldValue] = useState<string | null>(null)

  const formApi = useRef<BaseFormApi>();

  useEffect(() => {
    Promise.all([bitable.base.getTableMetaList(), bitable.base.getSelection(), bitable.base.getActiveTable()])
      .then(async ([metaList, selection, activeTable]) => {
        const { tableId, fieldId } = selection;
        setTableMetaList(metaList);
        const fieldMetaList = await activeTable.getFieldMetaListByType(FieldType.DateTime)

        setFieldMetaList(fieldMetaList);

        // const fieldMeta = fieldId ? await activeTable.getFieldMetaById(fieldId) : null;
        // const isDateTimeField = fieldMeta?.type === FieldType.DateTime;
        formApi.current?.setValues({
          table: tableId,
          // field: isDateTimeField ? fieldId : null
        });
      });
  }, []);

  useEffect(() => {
    const off = bitable.base.onSelectionChange(async (event: { data: Selection }) => {
      const { tableId, fieldId } = event.data;

      if (tableId === formApi.current?.getValue('table')) return;

      const table = await bitable.base.getActiveTable();
      const fieldMetaList = await table.getFieldMetaListByType(FieldType.DateTime)

      setFieldMetaList(fieldMetaList);
      setFieldValue(null)
      // const fieldMeta = fieldId ? await table.getFieldMetaById(fieldId) : null;
      // const isDateTimeField = fieldMeta?.type === FieldType.DateTime;

      formApi.current?.setValues({
        table: tableId,
        field: null,
        // field: isDateTimeField ? fieldId : null
      });
    })

    return () => { off?.() }
  }, [bitable])

  const gen = useCallback(async () => {

    console.log(11111)
    const selectedTable = formApi.current?.getValue('table')
    const table = await bitable.base.getTableById(selectedTable);
    const fieldId = formApi.current?.getValue('field')
    const fieldMetaList = await table.getFieldMetaList()
    const xingzuoField = fieldMetaList?.filter(item => item.name === t('sign'))?.[0]
    const xingzuoFieldId = xingzuoField?.id || await table.addField({
      type: FieldType.Text,
      name: t('sign')
    })
    console.log(22222, fieldId, xingzuoFieldId)

    const records = (await table.getRecords({ pageSize: 5000 })).records
    console.log(33333, records)


    const updatedRecords = records.map((record, i) => {
      const val = record.fields[fieldId] as number | null
      if (typeof val !== 'number') return null;

      const xingzuo = genZodiacSign(val, i18n.language)
      return {
        recordId: record.recordId,
        fields: {
          [xingzuoFieldId]: xingzuo,
        },
      }
    }).filter(item => !!item) as { recordId: string; fields: { [x: string]: any; }; }[]

    await table.setRecords(
      updatedRecords
    )
  }, [bitable])

  useEffect(() => {
    console.log(66666, fieldValue)
  }, [fieldValue])


  return (
    <main className="main">
      <h4>
        {t('title')}
      </h4>
      <br />
      <Form labelPosition='top' onSubmit={gen} getFormApi={(baseFormApi: BaseFormApi) => formApi.current = baseFormApi}>
        <Form.Select field='table' label={t('selectTable')} style={{ width: '100%' }}>
          {
            Array.isArray(tableMetaList) && tableMetaList.map(({ name, id }) => {
              return (
                <Form.Select.Option key={id} value={id}>
                  {name}
                </Form.Select.Option>
              );
            })
          }
        </Form.Select>
        <Form.Select field='field' label={t('selectField')} onChange={setFieldValue} style={{ width: '100%' }}>
          {
            Array.isArray(fieldMetaList) && fieldMetaList.map(({ name, id }) => {
              return (
                <Form.Select.Option key={id} value={id}>
                  {name}
                </Form.Select.Option>
              );
            })
          }
        </Form.Select>
        <Button theme='solid' disabled={!fieldValue} htmlType='submit'>{t('genSign')}</Button>
      </Form>
      <br />
      <Space>
          <Tag size="small" color='light-blue'>{t('tips')}</Tag>
      </Space>
    </main>
  )
}
