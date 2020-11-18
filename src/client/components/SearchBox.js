import React, { Component } from 'react';
import TextSearch from './TextSearch';

export default class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    handleChangeTab(event, cityName) {
        let tabContent = [];
        let tabLink = [];
        tabContent = document.getElementsByClassName('tabContent');
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = 'none';
        }
        tabLink = document.getElementsByClassName('tabLink');
        for (let i = 0; i < tabLink.length; i++) {
            tabLink[i].className = tabLink[i].className.replace(' active', '');
        }
        document.getElementById(cityName).style.display = 'block';
        event.currentTarget.className += ' active';
    }

    render() {
        return (
            <div id="box" className="gradientBorder">
                <div className="tab">
                    <button type="button" className="tabLink active" onClick={(event) => { this.handleChangeTab(event, 'textSearch'); }}>Text Search</button>
                    <button type="button" className="tabLink" onClick={(event) => { this.handleChangeTab(event, 'audioSearch'); }}>Audio Search</button>
                    <button type="button" className="tabLink" onClick={(event) => { this.handleChangeTab(event, 'instructions'); }}>Instructions</button>
                </div>
                <div id="textSearch" className="tabContent" style={{ display: 'block' }}>
                    <TextSearch onSubmit={this.props.onSubmit} />
                </div>
                <div id="audioSearch" className="tabContent">
                    Coming Soon
                </div>
                <div id="instructions" className="tabContent">
                    Instructions Here
                </div>
            </div>
        );
    }
}
