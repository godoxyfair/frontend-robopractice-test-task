import {useEffect, useState} from "react";
import moment from "moment/moment";


export function useDataUsersTransform(data, trueArrayDays) {

    const [usersDataObject, setUsersDataObject] = useState([])

    //Преобразование полученных данных
    //Convert received data
    useEffect(() => {

        if (data && data?.length > 0) {

            function arrayMutation(user) {
                const newArrayDate = []
                for (let s of trueArrayDays) {
                    const found = user?.Days?.find(feature => feature?.Date === s);
                    newArrayDate.push(found || {Date: s, End: '00-00', Start: '00-00'});
                }
                return {id: user?.id, Fullname: user?.Fullname, Days: newArrayDate}
            }
            //Получим данные с недостающими датами и заменим End Start на 00:00
            //Get data with missing dates and replace End Start with 00:00
            const newUsers = data.map(user => {
                return arrayMutation(user)
            })

            function getDataDuration(user) {
                //parsing the string into hours, minutes
                function getElementDuration(el) {
                    //using moment.js library
                    const res = moment.duration(el.End.replace("-", ":"))
                        .subtract(moment.duration(el.Start.replace("-", ":")));

                    return  res.hours() + ":" + res.minutes();
                }

                //ArrayWithDuration возвращает обогащенныей durationMs array Days
                //ArrayWithDuration returns improved durationMs array Days
                const arrayWithDuration = user.Days.map((elem) => {
                    return {...elem, durationMs: getElementDuration(elem)}
                })
                return {id: user?.id, Fullname: user?.Fullname, Days: arrayWithDuration}

            }
            //Получим данный с durationMs
            //Add the given durationMs
            const newUsersDuration = newUsers.map(user => {
                return getDataDuration(user)
            })

            function getUsersDurationWithTotal(user) {
                let sum = moment.duration("00:00");
                let temp = 0;

                for (let i = 0; i < user.Days.length; i++) {
                    temp = moment.duration(user.Days[i].durationMs.replace("-", ":"))
                    sum = sum.add(temp)
                }
                let result = 24 * sum.days() + sum.hours() + ":" + sum.minutes()
                return {id: user?.id, Fullname: user?.Fullname, Days: user?.Days, Total: result}
            }
            //Получим данные с Total для user
            //Get data from Total for user
            const newUsersDurationTotal = newUsersDuration.map(user => {
                return getUsersDurationWithTotal(user)
            })

            function userArrayToObject(user) {
                let dataObjectMy = {}

                dataObjectMy = user.Days.reduce((acc, element) => {
                    return {...acc, [element.Date]: element.durationMs}
                }, {id: user?.id, Fullname: user?.Fullname, Total: user?.Total})
                return dataObjectMy
            }
            //Заполним объект всеми нужными для работы с таблицей данными
            //Fill the object with all the data needed to work with the table
            const newUsersDate = newUsersDurationTotal.map(user => {
                return userArrayToObject(user)
            })
            setUsersDataObject(newUsersDate)

        }
    }, [data])

    return usersDataObject;
}