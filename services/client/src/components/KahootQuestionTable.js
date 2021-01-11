import React from 'react';
import {Table, Col, Tag, Select, InputNumber, Button, Tooltip, Space, Typography, List} from 'antd';
import {CloseCircleOutlined} from "@ant-design/icons";
import {colors} from "../constants";

function KahootQuestionTable(questionGenerators,
                             categoryToData,
                             questionTypes,
                             questionTypesReversed,
                             onParamChange,
                             onQuestionCreated,
                             onQuestionDeleted,
                             onQuestionNumChanged) {
    return (
        <>
            <Table
                dataSource={questionGenerators}
                pagination={false}
                rowKey={({key}) => key}
                footer={(currentPageData) =>
                    <Button
                        onClick={onQuestionCreated}
                        type={'primary'}
                    >
                        Add a question
                    </Button>}
            >
                <Col title='Question Type'
                     dataIndex='questionType'
                     key='questionType'
                     render={(questionType, {key}) =>
                         <Select
                             defaultValue={questionTypes[questionType]}
                             options={Object.keys(questionTypesReversed).map(value => ({value: value}))}
                             onChange={question => onParamChange('questionType')(key)(questionTypesReversed[question])}
                             style={{width: '100%'}}

                         />
                     }
                     width='20%'
                />
                <Col title='# of Questions'
                     dataIndex='numOfQuestions'
                     key='numOfQuestions'
                     width='5%'
                     render={(numOfQuestions, {key}) =>
                         <InputNumber
                             defaultValue={numOfQuestions}
                             min={0}
                             precision={0}
                             onChange={newNumOfQuestions => {
                                 onParamChange('numOfQuestions')(key)(newNumOfQuestions)
                                 onQuestionNumChanged()
                             }}
                             type={'number'}
                         />
                     }
                />
                <Col title='Categories'
                     dataIndex='categories'
                     key='categories'
                     width='75%'
                     render={(categories, {key}) => (<>
                         <Select
                             allowClear={true}
                             defaultValue={categories}
                             mode={'multiple'}
                             style={{minWidth: '50%'}}
                             tagRender={({value, closable, onClose}) => {
                                 const data = categoryToData[value]
                                 // const color = data.color
                                 const tagParams = {
                                     color: categoryToData[value].color,
                                     key: value,
                                     closable: closable,
                                     onClose: onClose,
                                 }
                                 const tooltipParams = {
                                     placement: 'top',
                                     title: () => <List
                                         dataSource={[
                                             ['Number of Terms', data.rowCount],
                                             ['Number of Terms with Synonyms', data.synonymRowCount],
                                             ['Number of Terms with Antonyms', data.antonymRowCount],
                                         ]}
                                         renderItem={(entry) =>
                                             <Space split={' '}>
                                                 <Typography.Text>{entry[0]}:</Typography.Text>
                                                 <Typography.Text>{entry[1]}</Typography.Text>
                                             </Space>
                                         }
                                     >
                                     </List>
                                 }
                                 return (
                                     <Tooltip {...tooltipParams}>
                                         <Tag {...tagParams}>{value}</Tag>
                                     </Tooltip>
                                 )
                             }}
                             options={Object.entries(categoryToData).map(([key, value]) => ({'value': key}))}
                             onChange={onParamChange('categories')(key)}
                             placeholder={'Select some categories!'}
                         >
                         </Select>
                     </>)}/>
                <Col
                    title=''
                    key='deleteAction'
                    render={(_, {key}) =>
                        <CloseCircleOutlined
                            twoToneColor={colors.red}
                            onClick={onQuestionDeleted(key)}
                        />
                    }
                />
            </Table>
        </>)
}

export default KahootQuestionTable