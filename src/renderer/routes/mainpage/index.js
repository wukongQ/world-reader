import React, { Component, Fragment } from 'react'
import { Input, Button, Icon, message, Popconfirm } from 'antd'
import { ipcRenderer, remote } from 'electron'
import data from '../data'
import styles from './index.scss'

class MainPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filepath: data.load('filepath') ? data.load('filepath') : '',
      archive: data.load('archive') ? data.load('archive') : [],
      showDetailPath: false
    }

    this.archiveDoms = []
  }

  handleSelectPath = () => {
    ipcRenderer.send('select-path')
    ipcRenderer.once('select-path-response', (e, arg) => {
      data.save('filepath', arg[0])
      this.setState({
        filepath: arg[0]
      })
    })
  }

  handleShowPathDetail = () => {
    const { showDetailPath } = this.state
    this.setState({
      showDetailPath: !showDetailPath
    })
  }

  handleAddFile = () => {
    const { archive } = this.state
    archive.push({
      roleName: '',
      fileName: ''
    })
    this.setState({ archive }, () => {
      this.saveArchive()
    })
  }

  handleItemFileNameChange = (index, e) => {
    const { archive } = this.state
    if (e.target.value.length < 20) {
      archive[index].fileName = e.target.value
      this.setState({ archive }, () => {
        this.saveArchive()
      })
    }
  }

  handleReadArchive = item => {
    const { filepath } = this.state
    if (item.fileName.trim().length > 0) {
      ipcRenderer.send('read-file', `${filepath}/${item.fileName}.txt`)
      ipcRenderer.once('read-file-end', (e, arg) => {
        message.success('读取成功')
      })
    } else {
      message.warning('存档名不能为空')
    }
  }

  handleDeleteArchive = index => {
    const { archive } = this.state
    archive.splice(index, 1)
    this.setState({ archive }, () => {
      this.saveArchive()
    })
  }

  saveArchive = () => {
    const { archive } = this.state
    data.save('archive', archive)
  }

  render () {
    const { filepath, archive,showDetailPath } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <Button type='primary' onClick={this.handleSelectPath}>{filepath ? '更改' : '选择' }存档路径</Button>
          {
            filepath
              ? (
                <Fragment>
                  <Button type='link' onClick={this.handleShowPathDetail}>{showDetailPath ? '隐藏' : '查看' }当前路径</Button>
                  {
                    showDetailPath
                      ? (
                        <p className={styles.pathDetail}>当前路径: {filepath}</p>
                      )
                      : ''
                  }
                </Fragment>
              )
              : ''
          }
        </div>
        {
          filepath ? (
            <div className={styles.main}>
              <div className={styles.content}>
                {
                  archive.map((item, index) => {
                    return (
                      <div className={styles.archiveItem} key={index} ref={dom => { this.archiveDoms[index] = dom }}>
                        <div>
                          <span>名称</span>
                          {/* <Input /> */}
                        </div>
                        <div className={styles.fileNameArea}>
                          <Input
                            value={item.fileName}
                            placeholder='存档名'
                            onChange={this.handleItemFileNameChange.bind(this, index)}
                            style={{width: 80, padding: 4}}
                          />.txt
                        </div>
                        <div className={styles.operationArea}>
                          <Button type='primary' size='small' onClick={this.handleReadArchive.bind(this, item)}>读取</Button>
                          <Popconfirm
                            title='确认要删除吗(此删除不影响存档源文件)'
                            onConfirm={this.handleDeleteArchive.bind(this, index)}
                            okText='确认'
                            cancelText='取消'
                            getPopupContainer={() => this.archiveDoms[index]}
                          >
                            <Icon type='delete' className={styles.deleteIcon}/>
                          </Popconfirm>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <Button type="dashed" className={styles.addBtn} onClick={this.handleAddFile} >添加存档</Button>
            </div>
          ) : ''
        }
      </div>
    )
  }
}

export default MainPage
