<style lang='less'>
	 @import './index.less';
</style>
<template>
	<div class="error-con">
		<div class="error-bg">
			<i class="error-icon"></i>
		</div>
		<div class="error-text">{{errorText}}</div>
	</div>
</template>

<script>
	export default {
	  props: {
	    errorText: {
	      type: String,
	      coerce: (val) => {
	        if (val === '') {
	          return '页面出错了'
	        }
	        return val
	      }
	    }
	  }
	}
</script>
