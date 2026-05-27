<script lang="ts">
	import type { AuxeroAccountPasswordFormData } from '$lib/auxero/account-forms';

	let { password }: { password: AuxeroAccountPasswordFormData } = $props();
</script>

<form action="#" class="bohemcars-password-form" novalidate data-bohemcars-password-form>
	<input type="hidden" name="role" value={password.role} />
	<input type="hidden" name="actorRole" value={password.role} />
	<div class="dashboard-box style-5 bg-white">
		<div class="change-password-wrapper flex flex-col gap-23">
			<label for="Email">
				<span class="font-weight-600 mb-8 flex">Your Email:*</span>
				<input
					class="input-large active"
					type="text"
					value={password.email}
					id="Email"
					name="Email"
					placeholder="Your Email*"
					required
				/>
			</label>

			<label for="OldPassword">
				<span class="font-weight-600 mb-8 flex">Old Password:*</span>
				<input
					class="input-large password-input is-hidden"
					type="password"
					value=""
					id="OldPassword"
					name="OldPassword"
					placeholder="Password"
					required
				/>
			</label>

			<label for="NewPassword">
				<span class="font-weight-600 mb-8 flex">New password:*</span>
				<input
					class="input-large password-input is-hidden"
					type="password"
					value=""
					id="NewPassword"
					name="NewPassword"
					placeholder="Password"
					required
				/>
			</label>

			<label for="RetypeNewPassword">
				<span class="font-weight-600 mb-8 flex">Retype new password:*</span>
				<input
					class="input-large password-input is-hidden"
					type="password"
					value=""
					id="RetypeNewPassword"
					name="RetypeNewPassword"
					placeholder="Password"
					required
				/>
			</label>

			<div class="flex">
				<button type="submit" class="btn btn-primary btn-large-3 font-weight-600">
					Change Password
				</button>
			</div>
		</div>
	</div>
</form>
