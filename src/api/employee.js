import request from '@/utils/request'

// 获取员工列表
export const getEmployee = ({ page, size }) => request({
  url: '/sys/user',
  params: { page, size }
})

// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

// 新增员工
export const addEmployees = data => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

// 获取员工基本信息
export const getEmployeesInfo = id => {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

// 获取所有角色列表
export const getRoleList = () => {
  return request({
    method: 'GET',
    url: '/sys/role'
  })
}

// 给角色分配权限
export const assignPrem = data => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}

// 删除员工
export const deleteEmployees = id => {
  return request({
    method: 'DELETE',
    url: `sys/user/${id}`
  })
}

// 保存员工信息
export const saveEmployee = (id, data) => {
  return request({
    url: `sys/user/${id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
