import React, { Component, Fragment } from 'react';
import { Dropdown, Segment, Header, Divider, Button, Icon, Grid } from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ItemList from '../item/ItemList/ItemList';
import GMap from '../map/GMap';
var jwt = require('jsonwebtoken');

// const cities = [
//     { key: 'sjca', text: 'San Jose', value: 'sjca' },
//     { key: 'sfca', text: 'San Francisco', value: 'sfca' },
//     { key: 'fmca', text: 'Fremont', value: 'fmca' },
// ]

const mexican = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]

const chinese = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]

const american = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]

const vietnamese = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]

const creperies = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]
const french = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]
const thai = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]
const japanese = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]
const italian = [
    { key: '1', text: 'yes', value: true },
    { key: '2', text: 'no', value: false }
]

class Preference extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const { auth } = props;

        var decoded = jwt.decode(auth.token, { complete: true });
        var userID = null
        if (decoded !== null) {
            userID = decoded.payload.id;
        }

        this.state = {
            // city: '',
            // selectedCity: null,
            userID: userID,
            uID: null,
            restaurants: [],
            rIDs: [],
            isLoading: false,
            isNewUser: false,
            isGettingRecommendations: false,
            currentLocation: {
                lat: 47.444,
                lng: -122.176
            },
            submitIsLoading: false,
            likes_mexican: false,
            likes_chinese: false,
            likes_american: false,
            likes_vietnamese: false,
            likes_creperies: false,
            likes_french: false,
            likes_thai: false,
            likes_japanese: false,
            likes_italian: false
        }
    }

    // this function has changed
    // get 30 recommendation from the backend
    // it was getting 5 directly from yelp API due to API limitaion.
    getFive = event => {

        var backendRAPI = "http://0.0.0.0:5000/api/v1.0/generatenewbusinessdata/newuser";

        this.setState({
            isGettingRecommendations: true
        });

        // clear the restaurants in state
        this.setState({
            restaurants: [],
        });
        const body = {
            userID: this.state.userID,
            likes_mexican: this.state.likes_mexican,
            likes_chinese: this.state.likes_chinese,
            likes_american: this.state.likes_american,
            likes_vietnamese: this.state.likes_vietnamese,
            likes_creperies: this.state.likes_creperies,
            likes_french: this.state.likes_french,
            likes_thai: this.state.likes_thai,
            likes_japanese: this.state.likes_japanese,
            likes_italian: this.state.likes_italian
        };
        // get recommendation from backend
        axios
            .post(backendRAPI, body)
            .then(res => {
                if (res) {
                    let temp = res.data.business_data;
                    console.log(temp);
                    this.setState({
                        restaurants: temp,
                        isGettingRecommendations: false,
                        currentLocation: {
                            lat: temp[0].coordinates.latitude,
                            lng: temp[0].coordinates.longitude
                        }
                    });
                } else {
                    console.log("Failed to load user data");
                }
            })
            .catch(err => {
                console.log(err.data);
            });

        // below commented out code is for using heroku server
        // changed to used the backend to do it.
        // if (this.state.rIDs[0] !== undefined) {
        //     // need a loop to 'put' each object into restrant array
        //     var restaurantsArr = [];
        //     var yelpAPI = "0.0.0.0:5000/api/v1.0/generatenewbusinessdata/newuser";
        //     var count = this.state.restaurants.length;

        //     // works, but too many requests at the same time make yelp API deny
        //     for (let i = count; i < count + 5; i++) {

        //         yelpAPI = `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/` + this.state.rIDs[i];

        //         restaurantsArr.push(
        //             axios.get(yelpAPI, {
        //                 headers: {
        //                     Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
        //                 }
        //             }).then(
        //                 result => new Promise(resolve => {
        //                     this.setState({
        //                         isLoading: true
        //                     })
        //                     resolve(result.data)
        //                 })
        //             ).catch((err) => {
        //                 console.log('error')
        //             })
        //         );
        //     }

        //     Promise.all(restaurantsArr).then(res => {
        //         var tempArr = this.state.restaurants;
        //         var newRestArr = tempArr.concat(res);
        //         this.setState({
        //             restaurants: newRestArr,
        //             isLoading: false,
        //             //Seattle
        //             currentLocation: {
        //                 lat: newRestArr[0].coordinates.latitude,
        //                 lng: newRestArr[0].coordinates.longitude
        //             }
        //         })
        //         // console.log(newRestArr);
        //     });
        // }

    }


    componentDidMount() {
        // below commented out code will crash the app when refresh this page, becareful
        // console.log("props " + this.props.auth.user._id);

        var getUserInforAPI = '/api/users/';
        // get the uID, 
        // existing users have uID, 
        // new users have not uID
        axios
            .get(getUserInforAPI + this.state.userID)
            .then(res => {
                // console.log("user object : ");
                // console.log(res.data.uID);
                if (!res.data.uID) {
                    this.setState({
                        isNewUser: true
                    })
                    var userID = this.state.userID;

                    if (userID !== null) {
                        var address = '/api/preferences/' + userID;
                        axios
                            .get(address)
                            .then(res => {
                                if (res) {
                                    if (res.data.length !== 0) {
                                        this.setState({
                                            likes_mexican: res.data[0].likes_mexican,
                                            likes_chinese: res.data[0].likes_chinese,
                                            likes_american: res.data[0].likes_american,
                                            likes_vietnamese: res.data[0].likes_vietnamese,
                                            likes_creperies: res.data[0].likes_creperies,
                                            likes_french: res.data[0].likes_french,
                                            likes_thai: res.data[0].likes_thai,
                                            likes_japanese: res.data[0].likes_japanese,
                                            likes_italian: res.data[0].likes_italian
                                        });
                                    }
                                } else {
                                    console.log("Failed to load user data");
                                }
                            })
                            .catch(err => {
                                console.log(err.data);
                            });
                        this.getFive();
                    }
                } else {
                    this.setState({
                        uID: res.data.uID,
                        isGettingRecommendations: true
                    })

                    var existingUserAPI = "http://0.0.0.0:5000/api/v1.0/generatebusinessdata/" + res.data.uID
                    axios
                        .get(existingUserAPI)
                        .then(res => {
                            let temp = res.data.business_data;
                            console.log(temp);
                            this.setState({
                                restaurants: temp,
                                isGettingRecommendations: false,
                                currentLocation: {
                                    lat: temp[0].coordinates.latitude,
                                    lng: temp[0].coordinates.longitude
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err.data);
                        });
                }
            })
            .catch(err => {
                console.log(err.data);
            });
    }

    handleSubmit = event => {
        event.preventDefault();

        var userID = this.state.userID;
        // Headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        // Request body
        const body = {
            userID: userID,
            likes_mexican: this.state.likes_mexican,
            likes_chinese: this.state.likes_chinese,
            likes_american: this.state.likes_american,
            likes_vietnamese: this.state.likes_vietnamese,
            likes_creperies: this.state.likes_creperies,
            likes_french: this.state.likes_french,
            likes_thai: this.state.likes_thai,
            likes_japanese: this.state.likes_japanese,
            likes_italian: this.state.likes_italian
        };
        // Let backend handle preference update in DB
        // //update preference in database
        // axios
        //     .post('/api/preferences', body, config)
        //     .then(res => {
        //         // console.log("I was below");
        //         // console.log(res);
        //         // console.log(res.data);
        //         // console.log("I was above");
        //     })
        //     .catch(err => {
        //         console.log(err.data);
        //     });

        // get recommendations from backend
        var backendAPI = "http://0.0.0.0:5000/api/v1.0/submit";

        this.setState({
            submitIsLoading: true
        });

        // clear the restaurants in state
        this.setState({
            restaurants: [],
        });
        // get recommendation from backend
        axios
            .post(backendAPI, body, config)
            .then(res => {
                if (res) {
                    // console.log(res);
                    this.setState({
                        submitIsLoading: false
                    });
                } else {
                    console.log("Failed to load user data");
                }
            })
            .catch(err => {
                console.log(err.data);
            });
    }

    // onChangeCity = (e, data) => {
    //     console.log(data.value);
    //     this.setState({
    //         selectedCity: data.value,
    //         city: data.valve
    //     });
    // }

    onChangeMexican = (e, data) => {
        this.setState({
            likes_mexican: data.value
        });
    }
    onChangeChinese = (e, data) => {
        // console.log(data.value);
        this.setState({
            likes_chinese: data.value
        });
    }
    onChangeAmerican = (e, data) => {
        // console.log('data.value ' + data.value);
        this.setState({
            likes_american: data.value
        });
    }
    onChangeVietnamese = (e, data) => {
        this.setState({
            likes_vietnamese: data.value
        });
    }
    onChangeCreperies = (e, data) => {
        this.setState({
            likes_creperies: data.value
        });
    }
    onChangeFrench = (e, data) => {
        this.setState({
            likes_french: data.value
        });
    }
    onChangeThai = (e, data) => {
        this.setState({
            likes_thai: data.value
        });
    }
    onChangeJapanese = (e, data) => {
        this.setState({
            likes_japanese: data.value
        });
    }
    onChangeItalian = (e, data) => {
        this.setState({
            likes_italian: data.value
        });
    }

    render() {
        // works
        // const { isAuthenticated, user } = this.props.auth;

        // const {
        //     // city, selectedCity,
        //     // priceRange, selectedPriceRange,
        //     // category, selectedCategory
        // } = this.state;
        return (
            <Fragment>
                {this.state.isNewUser ? <Segment>
                    {/* <Header>City:</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='world'
                        options={cities}
                        search
                        text={city}
                        city={city}
                        value={selectedCity}
                        onChange={this.onChangeCity}
                    />
                    <Divider /> */}

                    {/* works */}
                    {/* <div>`${user._id}`</div> */}

                    <Header>Do you like American food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={american}
                        selection
                        placeholder={this.state.likes_american ? "yes" : "no"}
                        valve={this.state.likes_american}
                        onChange={this.onChangeAmerican}
                    />
                    <Divider />
                    <Header>Do you like Chinese food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={chinese}
                        selection
                        placeholder={this.state.likes_chinese ? "yes" : "no"}
                        valve={this.state.likes_chinese}
                        onChange={this.onChangeChinese}
                    />
                    <Divider />
                    <Header>Do you like Mexican food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={mexican}
                        selection
                        placeholder={this.state.likes_mexican ? "yes" : "no"}
                        valve={this.state.likes_mexican}
                        onChange={this.onChangeMexican}
                    />
                    <Divider />
                    <Header>Do you like Vietnamese food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={vietnamese}
                        selection
                        placeholder={this.state.likes_vietnamese ? "yes" : "no"}
                        valve={this.state.likes_vietnamese}
                        onChange={this.onChangeVietnamese}
                    />
                    <Divider />
                    <Header>Do you like Creperies food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={creperies}
                        selection
                        placeholder={this.state.likes_creperies ? "yes" : "no"}
                        valve={this.state.likes_creperies}
                        onChange={this.onChangeCreperies}
                    />
                    <Divider />
                    <Header>Do you like French food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={french}
                        selection
                        placeholder={this.state.likes_french ? "yes" : "no"}
                        valve={this.state.likes_french}
                        onChange={this.onChangeFrench}
                    />
                    <Divider />
                    <Header>Do you like Thai food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={thai}
                        selection
                        placeholder={this.state.likes_thai ? "yes" : "no"}
                        valve={this.state.likes_thai}
                        onChange={this.onChangeThai}
                    />
                    <Divider />
                    <Header>Do you like Japanese food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={japanese}
                        selection
                        placeholder={this.state.likes_japanese ? "yes" : "no"}
                        valve={this.state.likes_japanese}
                        onChange={this.onChangeJapanese}
                    />
                    <Divider />
                    <Header>Do you like Italian food</Header>
                    <Dropdown
                        button
                        className='icon'
                        fluid
                        labeled
                        icon='heart outline'
                        options={italian}
                        selection
                        placeholder={this.state.likes_italian ? "yes" : "no"}
                        valve={this.state.likes_italian}
                        onChange={this.onChangeItalian}
                    />
                    <Divider />
                    <p></p>
                    <Button onClick={this.handleSubmit} postive content='Submit' />{this.state.submitIsLoading ? <Icon name='spinner'>Loading...</Icon> : ''}
                </Segment> :
                    <p></p>
                }

                <Grid >
                    <Grid.Column width={11}>
                        <ItemList items={this.state.restaurants} />
                        <p></p>
                        <p>
                            {this.state.restaurants.length < 30 ?
                                <p>{!this.state.uID ? <Button color="teal" onClick={this.getFive} postive content='Get recommended restaurants' /> : <p></p>}</p>
                                :
                                <p>Only showing 30 recommended restaurants.</p>}
                            {this.state.isGettingRecommendations ? <Icon name='spinner'>Loading...</Icon> : ''}
                        </p>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <GMap items={this.state.restaurants} currentLocation={this.state.currentLocation} />
                    </Grid.Column>
                </Grid>
                {this.state.isLoading ? <Icon name='spinner'>Loading...</Icon> : ''}

            </Fragment >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(Preference);

