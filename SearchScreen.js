import React from 'react';
import {ScrollView, Text, View,StyleSheet, TextInput, TouchableWithoutFeedbackBase} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config'
export default class SearchScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            allTransaction:[],
            lastVisibleTransaction:null,
            search:''
        }
    }
    componentDidMount=async()=>{
        const query =await db .collection("transcation").limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTransaction:[...this.state.allTransaction,doc.data()]
            })
        })
    }
    fetchMoreTransaction=async()=>{
        var text = this.state.search.toUpperCase();
        var enteredText =text.split("");
        if(enteredText[0].toUpperCase()==='B'){
            const query=await db.collection("transcation").where("bookId",'==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.doc.map((doc)=>{
                this.setState({
                    allTransaction:[...this.state.allTransaction,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }
        else if(enteredText[0].toUpperCase()==='S'){
            const query=await db.collection("transcation").where("studentId",'==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            query.doc.map((doc)=>{
                this.setState({
                    allTransaction:[...this.state.allTransaction,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }
    }
    searchTranscation=async(text)=>{
        var enteredText=text.split("");
        var text= text.toUpperCase();
        if(enteredText[0].toUpperCase()==='B'){
            const transaction = await db.collection('transcation').where("bookId",'==',text).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransaction:[...this.state.allTransaction,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }
        else if(enteredText[0].toUpperCase()==='S'){
            const transaction = await db.collection('transcation').where("studentId",'==',text).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransaction:[...this.state.allTransaction,doc.data()],
                    lastVisibleTransaction:doc
                })
            })
        }
    }
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
              {/* <ScrollView>
                    {this.state.allTransaction.map((transaction,index)=>{
                        return(
                            <View key={index} style={{borderBottomWidth:2}}>
                                <Text>{"Book Id :"+transaction.bookId}</Text>
                                <Text>{"Student Id :"+transaction.studentId}</Text>
                                <Text>{"Transcation Type :"+transaction.transactionType}</Text>
                                <Text>{"Date :"+transaction.date.toDate()}</Text>
                            </View>
                        )
                    })}
                </ScrollView>*/}
        <View style={styles.searchBar}>
                <TextInput style={styles.bar}
                placeholder="Enter BookId or StudentId"
                onChangeText={(text)=>{this.setState({search:text})}}/>
                <TouchableOpacity style={styles.searchButton}
                onPress={()=>{this.searchTranscation(this.state.search)}}>
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>

                
               
                <FlatList
                data={this.state.allTransaction}
                renderItem={({item})=>(
                    <View style={{borderBottomWidth:2}}>
                        <Text>{"Book Id :"+item.bookId}</Text>
                        <Text>{"Student Id :"+item.studentId}</Text>
                        <Text>{"Transcation Type :"+item.transactionType}</Text>
                        <Text>{"Date :"+item.date.toDate()}</Text>
                    </View>
                )}
                keyExtractor={(item,index)=>index.toString()}
                onEndReached={this.fetchMoreTransaction}
                onEndReachedThreshold={0.5}
                />
                <Text> Search</Text>
            </View>
        )
    }

    
}
const styles =StyleSheet.create({
searchBar:{
    flexDirection:"row",
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'gray'
},
bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10
},
searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
}
})