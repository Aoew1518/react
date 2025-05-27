import { Select, Row, Col, InputNumber, Slider, Drawer, Popover, Table } from 'antd';
import type { TableProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentModel, setTemperature, setMaxTokens } from "@/store/modules/mainStore"
import { useTranslation } from 'react-i18next';

interface DataType {
    scene: string;
    temperature: number;
}

export default function ModelSettings({ open, onClose }: { open: boolean, onClose: () => void }) {
    const dispatch = useDispatch();
    const { currentModel, temperature, maxTokens } = useSelector((state: any) => state.mainStore);
    const { Option } = Select;
    const { t } = useTranslation();

    const columns: TableProps<DataType>['columns'] = [
        {
            title: '场景',
            dataIndex: 'scene',
            key: 'scene',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '温度',
            dataIndex: 'temperature',
            key: 'temperature',
        },
    ];

    const data: DataType[] = [
        {
            scene: '代码生成/数学解题',
            temperature: 0.0,
        },
        {
            scene: '数据抽取/分析',
            temperature: 1.0,
        },
        {
            scene: '通用对话',
            temperature: 1.3,
        },
        {
            scene: '翻译',
            temperature: 1.3,
        },
        {
            scene: '创意类写作/诗歌创作',
            temperature: 1.5,
        },
    ]

    const temperatureContent = (
        <>
            <p>temperature 参数默认为 1.0。</p>
            <p>我们建议您根据如下表格，按使用场景设置 temperature</p>
            <Table<DataType>
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </>
    );

    const modelContent = (
        <>
            <p>model 参数默认为 deepseek-chat。</p>
            <p>deepseek-chat 对应 DeepSeek-V3，用于日常对话。</p>
            <p>deepseek-reasoner 对应 DeepSeek-R1，用于深度思考。</p>
            <p>gpt-4o 等模型暂未开放。</p>
            <p>注意：deepseek-reasoner 推理模型不支持的参数：temperature，若设置参数不会报错，但也不会生效；不支持功能：Function Call</p>
        </>
    );

    const maxTokensContent = (
        <>
            <p>max_tokens 默认为 1024。</p>
            <p>Token 是模型用来表示自然语言文本的的最小单位，可以是一个词、一个数字或一个标点符号等。</p>
            <p>一般情况下模型中 token 和字数的换算比例大致如下：</p>
            <p>1 个英文字符 ≈ 0.3 个 token</p>
            <p>1 个中文字符 ≈ 0.6 个 token</p>
        </>
    );

    // 更改模型参数
    function handleModelChange(value: string) {
        dispatch(setCurrentModel(value));
    }

    // 更改模型最大输出量
    function handleMaxTokenChange(value: number) {
        dispatch(setMaxTokens(Number(value)));
    }

    // 更改模型自由度
    function handleTemperatureChange(value: number) {
        dispatch(setTemperature(value));
    }

    return (
        <>
            <Drawer
                title={'模型设置'}
                width={400}
                onClose={onClose}
                open={open}
                className="model-settings dark:!bg-gray-800 dark:text-white"
            >
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>
                        <span>更换模型 </span>
                        <Popover content={modelContent} title="模型说明" trigger="click">
                            <QuestionCircleOutlined />
                        </Popover>
                    </Col>
                    <Col>
                        <Select
                            value={currentModel}
                            onChange={handleModelChange}
                            style={{ width: 110 }}
                        >
                            <Option value="deepseek-chat">DeepSeek-v3</Option>
                            <Option value="deepseek-reasoner">DeepSeek-R1</Option>
                            <Option value="gpt-35-turbo">GPT-3.5</Option>
                            <Option value="GPT-4">GPT-4</Option>
                        </Select>
                    </Col>
                </Row>
                <hr className='my-4 opacity-50 dark:opacity-30' />
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>
                        <span>最大输出长度 </span>
                        <Popover content={maxTokensContent} title="max_tokens 说明" trigger="click">
                            <QuestionCircleOutlined />
                        </Popover>
                    </Col>
                    <Col>
                        <Select
                            value={maxTokens}
                            onChange={handleMaxTokenChange}
                            style={{ width: 110 }}
                        >
                            <Option value="1024">1024</Option>
                            <Option value="2048">2048</Option>
                            <Option value="4096">4096</Option>
                        </Select>
                    </Col>
                </Row>
                <hr className='my-4 opacity-50 dark:opacity-30' />
                <Row
                    align="middle"
                    justify="space-between"
                    wrap={false}
                >
                    <Col>
                        <span>模型自由度 </span>
                        <Popover content={temperatureContent} title="temperature 说明" trigger="click">
                            <QuestionCircleOutlined />
                        </Popover>
                    </Col>
                    <Col span={12}>
                        <Slider
                            min={0}
                            max={2}
                            step={0.1}
                            onChange={handleTemperatureChange}
                            value={typeof temperature === 'number' ? temperature : 0}
                        />
                    </Col>
                    <Col span={4}>
                        <Row
                            justify="end"
                        >
                            <InputNumber
                                min={0}
                                max={2}
                                step={0.1}
                                value={temperature}
                                onChange={(value) => handleTemperatureChange(value as number)}
                            />
                        </Row>

                    </Col>
                </Row>
            </Drawer>
        </>
    );
};