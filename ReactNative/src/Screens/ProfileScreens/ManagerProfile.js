import { StyleSheet, Text, View, TouchableOpacity,FlatList } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { userContext } from '../../General/userContext';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';
import {acceptType,blockORActiveUser,managerData} from '../../FetchCalls/profileAPI';

const ManagerProfile = () => {

  const { user } = useContext(userContext);

  const [usersTable,setUsersTable]=useState([]);
  const [typesTable,setTypesTable]=useState([]);

  const [dataForTable, setDataForTable] = useState({
    tableHead: [],
    tableData: usersTable
  });

  useEffect(() => {
    managerData(user.ID).then(
      (result) => {    
        if(result!= "NO")
        {
          setDataForKpi({
            currentOpenTasks: result.CurrentOpenTasks,
            tasksDone: result.TasksDone,
          }) 
          setUsersTable(result.UserList)
          setTypesTable(result.TypeList)
          setDataForTable({
            tableHead: ['משתמש', 'סטטוס', 'שינוי סטטוס'],
            tableData: result.UserList
          })
          return;
        }
      },
      (error) => {
        console.log("managerData ERROR: ",error);
      });
  },[])

  const [dataForKpi, setDataForKpi] = useState({
    currentOpenTasks: null,
    tasksDone: null,
  })

  const changeList = (changeto) => {

    setTableKind(changeto)

    if (changeto == "users") {
      
    console.log("yo")
      setDataForTable({
        tableHead: ['משתמש', 'סטטוס', 'שינוי סטטוס'],
        tableData: usersTable
      })
    }
    else {
      setDataForTable({
        tableHead: ['תחום עניין', 'מאושר', 'שנה אישור'],
        tableData: typesTable
      })
    }
  }


  const changeStatusUser = (id,index) => {
    console.log("change status=", id,index)
    blockORActiveUser(id).then(
      (result) => {    
        if(result!= "NO")
        {
          let temp = usersTable;
          temp[index] = result;
          setUsersTable(temp);
          changeList("users")
          return;
        }
      },
      (error) => {
        console.log("calendar tasks ERROR: ",error);
      });
  }

  const changeStatusType = (code,index) => {
    acceptType(code).then(
      (result) => {    
        if(result!= "NO")
        {
          let temp = typesTable;
          temp[index] = result;
          setTypesTable(temp);
          changeList("types")
          return;
        }
      },
      (error) => {
        console.log("calendar tasks ERROR: ",error);
      });
  }


  const [tableKind, setTableKind] = useState("users");

  const element = (data, index) => (
    <TouchableOpacity onPress={() => tableKind == "users" ?changeStatusUser(data,index):changeStatusType(data,index)}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>  {tableKind == "users" ? "שינוי" : data == "מאושר" ?  "בטל" :"אשר" } </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: "20%",height:"15%",marginTop: "5%",justifyContent: 'space-between'}}>
        <View style={styles.box}>
          <Text>{dataForKpi.currentOpenTasks}</Text>
          <Text>משימות פתוחות</Text>
        </View>
        <View style={styles.box}>
          <Text>{dataForKpi.tasksDone}</Text>
          <Text>משימות שנעשו</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => changeList("users")} style={styles.btnSubjectTable}>
          <Text> משתמשים </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeList("types")} style={styles.btnSubjectTable}>
          <Text> תחומי עניין </Text>
        </TouchableOpacity>
      </View>
        <Table style={{height:'43%'}} >   
          <Row data={dataForTable.tableHead} style={styles.head} textStyle={{textAlign: 'center'}}/>
            <FlatList
              data={dataForTable.tableData}
              extraData={dataForTable.tableData}
              keyExtractor = {(item,index)=> index}
              renderItem ={({item,index}) => {
                return(
                <TableWrapper key={index} style={styles.row}>
                {
                  item.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={cellIndex === dataForTable.tableHead.length - 1 ? element(cellData, index) : cellData}
                     textStyle={{textAlign: 'center',padding:5}} borderStyle={{borderColor:'grey'}}/>
                  ))
                }
              </TableWrapper>
              
              )}}
            />
        
          
        </Table>
    
    </View>
  )
}

export default ManagerProfile

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: "5%",

  },
  head: {
    height: 40,
    backgroundColor: 'white',
  },
  text: {
    // margin: 6,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    borderColor: 'grey', 
  },
  btn: {
    width: 58,
    backgroundColor: '#78B7BB',
    borderRadius: 2,
    alignSelf: 'center'
  },
  btnText: {
    textAlign: 'center',
    color: '#fff'
  },
  btnSubjectTable: {
    padding: 10,
    backgroundColor: '#B6E0D4',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    marginRight: 3
  },
  box: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: '45%',
    marginVertical: 10,
    height: '100%',
    alignItems:'center',
    justifyContent: 'center',
  },
})