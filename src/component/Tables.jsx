import React, {useEffect, useRef, useState} from 'react';
import PostService from "../API/PostService";
import moment from "moment/moment";
import {SearchOutlined} from '@ant-design/icons';
import {Button, Input, Space, Table} from 'antd';
import Highlighter from 'react-highlight-words';
import {useDataUsersTransform} from "./useDataUsersTransform";

const Tables = () => {
    useEffect(() => {
        async function getResponse() {
            setLoading(true)
            const tableArrayObject = await PostService.getALL()
            setData(tableArrayObject);
            setLoading(false)
        }

        getResponse();

    }, [])

    //Заполняем массив датами календаря для получания dataIndex и обработки users
    //Fill the array with calendar dates to get dataIndex and process users in table
    for(var trueArrayDays=[],dt=new Date("2021-05-01");
        dt <= new Date("2021-05-31");
        dt.setDate(dt.getDate() + 1)){
        trueArrayDays.push(new Date(dt).toISOString().slice(0, 10));
        }

    const [data, setData] = useState([])
    //used data transformation hook
    const tableReadyData = useDataUsersTransform(data, trueArrayDays);

    //Creating AntD table component
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false)

    function handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    }
    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#E7F7E3',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'User',
            dataIndex: 'Fullname',
            key: '2',
            fixed: 'left',
            width: 150,
            ...getColumnSearchProps('Fullname')
        },
    ];
    //make 31 days columns with hours
    let titleCount = 1;
    for (let s of trueArrayDays) {
        columns.push({
            key: s,
            title: titleCount,
            dataIndex: s,
            width: 80,
        });
        titleCount++
    }
    columns.push(
        {
            key: 33,
            title: 'Total',
            dataIndex: 'Total',
            fixed: 'right',
            width: 120,
            sorter: (a, b) => moment.duration(a.Total).subtract(moment.duration(b.Total))
        })

    return (
            <Table
                   loading={loading}
                   style={{margin: '20px'}}
                   rowkey={tableReadyData.id}
                   dataSource={tableReadyData}
                   columns={columns}
                   scroll={{
                       x: 100,
                   }}
                   title={() => 'May 2021'}
                   footer={() => 'Task for Red Mad Robot'}
            />
    );
};

export default Tables;