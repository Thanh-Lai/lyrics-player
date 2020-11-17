import React, { Component } from 'react';
import TextSearch from './TextSearch';

export default class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    handleChangeTab(event, cityName) {
        let i = 0;
        let tabcontent = [];
        let tablinks = [];
        tabcontent = document.getElementsByClassName('tabcontent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        tablinks = document.getElementsByClassName('tablinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        document.getElementById(cityName).style.display = 'block';
        event.currentTarget.className += ' active';
    }

    render() {
        return (
            <div id="box" className="gradient-border">
                <div className="tab">
                    <button type="button" className="tablinks" onClick={(event) => { this.handleChangeTab(event, 'textSearch'); }}>Text Search</button>
                    <button type="button" className="tablinks" onClick={(event) => { this.handleChangeTab(event, 'audioSearch'); }}>Audio Search</button>
                    <button type="button" className="tablinks" onClick={(event) => { this.handleChangeTab(event, 'instructions'); }}>Instructions</button>
                </div>
                <div id="textSearch" className="tabcontent">
                    <TextSearch onSubmit={this.props.onSubmit} />
                </div>

                <div id="audioSearch" className="tabcontent">
                    Coming Soon
                </div>

                <div id="instructions" className="tabcontent">
                    Instructions Here
                </div>
            </div>
        );
    }
}
